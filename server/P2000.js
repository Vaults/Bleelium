import {HTTP} from 'meteor/http';
import {postOrionData} from '/server/imports/orionAPI.js';
import {collectionWrapper} from '/server/imports/collections.js';
import {rewriteAttributes, handleError} from '/server/imports/util.js';
/**
 * @summary Creates orion-compliant P2000 object for Orion storage
 * @param {json} o - The JSON object of a P2000 entry from the p2000 rss feed
 * @return The orion-compliant P2000 object
 */
var createP2000Data = function(o){ //Creates orion-compliant objects for Orion storage
	return {
		"contextElements": [
			{
				"type": "P2000",
				"isPattern": "false",
				"id": o.guid[0]._,
				"attributes": [
          {
            "name": "title",
            "type": "string",
            "value": o.title[0]
          },
          {
            "name": "description",
            "type": "string",
            "value": o.description[0].replace(/\<(.*?)\>/g, '').replace('(', '').replace(')', '')
          },
					{
						"name": "publish_date",
						"type": "string",
						"value": o.pubDate[0]
					}
				]
			}
		],
		"updateAction": "APPEND"
	};
}
/**
 * @summary Sends all data pulled from P2000 to Orion
 */
var pushP2000ToOrion = function() {
	HTTP.call('GET', 'http://feeds.livep2000.nl/?r=22&d=1,2,3', handleError(function(response){
		xml2js.parseString(response.content, handleError(function(result){
			for(item in result.rss.channel[0].item) {
				postOrionData(createP2000Data(result.rss.channel[0].item[item]));
			}
		}));
	}));
}

/**
 * @summary Cronjob for pushing P2000 to orion, calls pushP2000ToOrion every 10 seconds
 */
SyncedCron.add({	//calls pushWeatherToOrion every 30 mins
    name: 'Pushing P2000 to Orion',
    schedule: function (parser) {
        return parser.text('every 10 seconds');
    },
    job: pushP2000ToOrion
});
/**
 *
 * @type {{name: string, args: string, f: P2000Pull.f}}
 */
var P2000Pull = {
	name: 'P2000',
	args: '?orderBy=!publish_date&limit=1000',
	f:  function(args){
		collectionWrapper['P2000'].remove({});
		response = rewriteAttributes(args);
		for(item in args.data.contextResponses) {
			var obj = args.data.contextResponses[item].contextElement;
			collectionWrapper['P2000'].upsert({_id: obj._id}, {$set: obj});
		}
	}
}

//exports for tests
export {createP2000Data, pushP2000ToOrion, P2000Pull}
