import {HTTP} from 'meteor/http';
import {postOrionData} from '/server/imports/orionAPI.js';
import {collectionWrapper} from '/server/imports/collections.js';
import {rewriteAttributes, handleError} from '/server/imports/util.js';
import {createP2000Data} from '/server/P2000DataSplitter.js';

/**
 * @summary Collects the rss feed from p2000 and stores it into Orion
 */
var pushP2000ToOrion = function () {
    HTTP.call('GET', 'http://feeds.livep2000.nl/?r=22&d=1,2,3', handleError(function (response) {
        xml2js.parseString(response.content, handleError(function (result) {
            for (item in result.rss.channel[0].item) {
                if (result.rss.channel[0].item[item]['geo:lat'] != null || result.rss.channel[0].item[item]['geo:long'] != null) {
                    var obj = createP2000Data(result.rss.channel[0].item[item]);
                    if (obj) {
                        postOrionData(obj);
                    }
                }
            }
        }));
    }));
}

/**
 * @summary Cronjob for pushing P2000 to orion, calls pushP2000ToOrion every 10 seconds
 */
SyncedCron.add({
    name: 'Pushing P2000 to Orion',
    schedule: function (parser) {
        return parser.text('every 10 seconds');
    },
    job: pushP2000ToOrion
});

/**
 * @summary Defines the variables for the p2000 pull, containing the name, arguments and the callback function.
 * @var {array} - P2000Pull
 */
var P2000Pull = {
    name: 'P2000',
    args: '?orderBy=!publish_date&limit=1000',
    f: function (args) {
        response = rewriteAttributes(args);
        for (item in args.data.contextResponses) {
            var obj = args.data.contextResponses[item].contextElement;
            collectionWrapper['P2000'].upsert({_id: obj._id}, {$set: obj});
        }
    }
}
/**
 * TODO: DOCS
 * @returns {any|*}
 */
var countSecurity = function () {
    var keyValueIfy = function (obj, counts) {
        obj.forEach(function (o) {
            counts[o._id] = o.count;
        });
    }
    var calcInsertSec = function () {
        var pipeline = [{$match: {'attributes.dt': {$gte: (new Date().getTime() - 24 * 60 * 60 * 1000) + ''}}}, {
            $group: {
                _id: '$attributes.type',
                count: {$sum: 1}
            }
        }];
        var counts = {};
        keyValueIfy(collectionWrapper['P2000'].aggregate(pipeline), counts);
        keyValueIfy(collectionWrapper['SoundSensor'].aggregate(pipeline), counts);
        keyValueIfy(collectionWrapper['criticalEvents'].aggregate(pipeline), counts);

        secAgg = {'_id': 'security', counts: counts, dt: new Date().getTime()};
        collectionWrapper['aggregationCache'].upsert({'_id': 'security'}, secAgg);
    }

    var secAgg = collectionWrapper['aggregationCache'].findOne({'_id': 'security'});
    if (!secAgg) {
        calcInsertSec();
    } else if (new Date().getTime() - secAgg.dt > 5000) {
        calcInsertSec();
    }
    return secAgg;
}

Meteor.methods({
    'aggregateSecurity'(){
        return countSecurity();
    }
});

//exports for tests
export {pushP2000ToOrion, P2000Pull}
