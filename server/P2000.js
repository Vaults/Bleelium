import {HTTP} from 'meteor/http';
import {postOrionData, deleteOrionData, deleteLocalData} from '/server/imports/orionAPI.js';
import {collectionWrapper} from '/server/imports/collections.js';
import {rewriteAttributes, handleError} from '/server/imports/util.js';
import {splitData,createP2000Data} from './P2000DataSplitter.js';

var p2000DataDeleter = function (id) {
    deleteLocalData('P2000');
    deleteOrionData("P2000",id);
}

var pushP2000ToOrion = function () {
    HTTP.call('GET', 'http://feeds.livep2000.nl/?r=22&d=1,2,3', handleError(function (response) {
        xml2js.parseString(response.content, handleError(function (result) {
            for (item in result.rss.channel[0].item) {

                //p2000DataDeleter(result.rss.channel[0].item[item]._id);
                //postOrionData(createP2000Data(result.rss.channel[0].item[item]));
                console.log(createP2000Data({ title: [ 'A2 (DIA: ) 5531AG 22 : Raambrug Bladel Obj: Rit: 41269~' ], link: [ 'http://monitor.livep2000.nl?SPI=1605261117520222' ], description: [ '1123117 <i name=w21 class=wb>MKA</i> Brabant Zuid-Oost ( <i name=w3910 class=wb>Ambulance</i> <i name=w3794 class=wb>22-117</i> Eersel )<br/>' ], pubDate: [ 'Thu, 26 May 2016 11:17:52 +0200' ], guid: [ { _: '1605261117520222', '$': [Object] } ], 'geo:lat': [ '51.3595589' ], 'geo:long': [ '5.2060685' ] }).contextElements[0].attributes)
            }
        }));
    }));
}

SyncedCron.add({	//calls pushWeatherToOrion every 30 mins
    name: 'Pushing P2000 to Orion',
    schedule: function (parser) {
        return parser.text('every 10 seconds');
    },
    job: pushP2000ToOrion
});

var P2000Pull = {
    name: 'P2000',
    args: '?orderBy=!publish_date&limit=1000',
    f: function (args) {
        collectionWrapper['P2000'].remove({});
        response = rewriteAttributes(args);
        for (item in args.data.contextResponses) {
            var obj = args.data.contextResponses[item].contextElement;
            collectionWrapper['P2000'].upsert({_id: obj._id}, {$set: obj});
        }
    }
}

//exports for tests
export {pushP2000ToOrion, P2000Pull}
