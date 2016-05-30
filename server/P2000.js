import {HTTP} from 'meteor/http';
import {postOrionData} from '/server/imports/orionAPI.js';
import {collectionWrapper} from '/server/imports/collections.js';
import {rewriteAttributes, handleError} from '/server/imports/util.js';
import {splitData, createP2000Data} from './P2000DataSplitter.js';

/**
 *
 */
var pushP2000ToOrion = function () {
    HTTP.call('GET', 'http://feeds.livep2000.nl/?r=22&d=1,2,3', handleError(function (response) {
        xml2js.parseString(response.content, handleError(function (result) {
            for (item in result.rss.channel[0].item) {

                if (result.rss.channel[0].item[item]['geo:lat'] != null || result.rss.channel[0].item[item]['geo:long'] != null) {
                    var obj = createP2000Data(result.rss.channel[0].item[item]);
                    if (obj){
                       // console.log(obj.contextElements[0].attributes);
                        postOrionData(obj);
                    }
                } else {
                }
            }
        }));
    }));
}

/**
 *
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
    f: function (args) {
        //collectionWrapper['P2000'].remove({});
        response = rewriteAttributes(args);
        for (item in args.data.contextResponses) {
            var obj = args.data.contextResponses[item].contextElement;
            collectionWrapper['P2000'].upsert({_id: obj._id}, {$set: obj});
        }
    }
}

//exports for tests
export {pushP2000ToOrion, P2000Pull}
