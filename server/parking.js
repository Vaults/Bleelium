/**
 * Created by s126763 on 7-6-2016.
 */
import {HTTP} from 'meteor/http';
import {postOrionData} from '/server/imports/orionAPI.js';
import {collectionWrapper} from '/server/imports/collections.js';
import {rewriteAttributes, handleError, isEqual} from '/server/imports/util.js';
import {pull} from '/server/imports/orionAPI.js';



/**
 * @summary Defines the variables for the ParkingSpacePull, containing the name, arguments and the callback function.
 * @var {array} - ParkingSpacePull
 */
var ParkingSpacePull = {
    name: 'ParkingSpace',
    args: '?orderBy=!publish_date&limit=1000',
    f: function (args) {
        response = rewriteAttributes(args);
        var update = {}; //{"0": {mod:{}}}
        for (item in args.data.contextResponses) {
            space = args.data.contextResponses[item].contextElement;
            if(!update[space.attributes.lotId]) {
                update[space.attributes.lotId] = [];
            }
            update[space.attributes.lotId].push(space);
        }
        for(key in update){
            var lot = collectionWrapper['ParkingLot'].findOne({_id: key});
            if(!isEqual(lot.parkingSpaces, update[key])){
                lot.parkingSpaces = update[key];
                collectionWrapper['ParkingLot'].upsert({_id:key}, {$set: lot});
                console.log('---');
                console.log(lot.parkingSpaces.length);
                console.log(update[key].length);
                console.log('---')
                var mod = {$set: {}};
                mod['$set']['parkingLots.' + key] = lot;
                collectionWrapper['ParkingArea'].update({_id: lot.attributes.garageId}, mod);
            }
        }
    }
};
/**
 * @summary Defines the variables for the ParkingLotPull, containing the name, arguments and the callback function.
 * @var {array} - ParkingLotPull
 */
var ParkingLotPull = {
    name: 'ParkingLot',
    args: '?orderBy=!publish_date&limit=1000',
    f: function (args) {
        response = rewriteAttributes(args);
        for (item in args.data.contextResponses) {
            var obj = args.data.contextResponses[item].contextElement;
            collectionWrapper['ParkingLot'].upsert({_id: obj._id}, {$set: obj});
        }

        pull(ParkingSpacePull.name, ParkingSpacePull.args, ParkingSpacePull.f );
        var lots =  collectionWrapper['ParkingLot'].find().fetch();
        for (lotKey in lots) {
            var lot = lots[lotKey];
            var mod = {$set: {}}
            mod['$set']["parkingLots." + lot._id] = lot;
            collectionWrapper['ParkingArea'].update({_id: lot.attributes.garageId}, mod);
        }
    }
};

/**
 * @summary Defines the variables for the ParkingAreaPull, containing the name, arguments and the callback function.
 * @var {array} - ParkingAreaPull
 */
var ParkingAreaPull = {
    name: 'ParkingArea',
    args: '?orderBy=!publish_date&limit=1000',
    f: function (args) {
        response = rewriteAttributes(args);
        for (item in args.data.contextResponses) {
            var obj = args.data.contextResponses[item].contextElement;
            collectionWrapper['ParkingArea'].upsert({_id: obj._id}, {$set: obj});;
        }
        pull(ParkingLotPull.name, ParkingLotPull.args, ParkingLotPull.f )
    }
};
/**
 * TODO: MORE DOCUMENTATION ON THIS ONE
 * @summary Returns aggregation object of the parking data. This is normally done in MongoDB's aggregation pipeline.
 * However, because of restrictions with Orion, we chose a key-value structure and this is not supported by MongoDB.
 * --COUNT SPACES PER AREA
 * --COUNT OCCUPIED SPACES PER AREA
 * --PERCENTAGE GLOBAL FREE SPACES
 * @returns {string}
 */
var countParking = function() {
    var parkingAreas = collectionWrapper['ParkingArea'].find().fetch();
    var spaceCounts = {total: 0};
    var occupiedCounts = {total: 0};
    for (areaKey in parkingAreas) {
        var area = parkingAreas[areaKey];
        spaceCounts[areaKey] = 0;
        occupiedCounts[areaKey] = 0;
        for (lotKey in area.parkingLots) {
            var lot = area.parkingLots[lotKey];
            for (spaceKey in lot.parkingSpaces) {
                var space = lot.parkingSpaces[spaceKey];
                if (space.attributes.occupied === "true") {
                    occupiedCounts[areaKey]++;
                    occupiedCounts['total']++;
                }
                spaceCounts[areaKey]++;
                spaceCounts['total']++;
            }
        }
    }
    return {spaces: spaceCounts, occupied: occupiedCounts};
}

Meteor.methods({
    'aggregateParking'(){
        return countParking();
    }
})

export {ParkingAreaPull, ParkingLotPull, ParkingSpacePull, countParking}