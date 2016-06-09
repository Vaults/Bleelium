/**
 * Created by s126763 on 7-6-2016.
 */
import {HTTP} from 'meteor/http';
import {postOrionData} from '/server/imports/orionAPI.js';
import {collectionWrapper} from '/server/imports/collections.js';
import {rewriteAttributes, handleError} from '/server/imports/util.js';
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
            collectionWrapper['ParkingArea'].upsert({_id: obj._id}, {$set: obj});
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

        for (item in args.data.contextResponses) {
            obj = args.data.contextResponses[item].contextElement;
            var mod = {$set: {}}
            mod['$set']["parkingLots." + obj._id] = obj;
            collectionWrapper['ParkingArea'].update({_id: obj.attributes.garageId}, mod);
        }
    }
};

/**
 * @summary Defines the variables for the ParkingSpacePull, containing the name, arguments and the callback function.
 * @var {array} - ParkingSpacePull
 */
var ParkingSpacePull = {
    name: 'ParkingSpace',
    args: '?orderBy=!publish_date&limit=1000',
    f: function (args) {
        response = rewriteAttributes(args);

        for (item in args.data.contextResponses) {
            obj = args.data.contextResponses[item].contextElement;
            var mod = {$set: {}}
            mod['$set']["parkingLots." + obj.attributes.lotId + ".parkingSpaces." + obj._id] = obj;
            var area = collectionWrapper['ParkingLot'].find({_id: obj.attributes.lotId}).fetch();
            collectionWrapper['ParkingArea'].update({_id: area[0].attributes.garageId}, mod);
        }
    }
};

Meteor.methods({
    /**
     * TODO: MORE DOCUMENTATION ON THIS ONE
     * @summary Returns aggregation object of the parking data. This is normally done in MongoDB's aggregation pipeline.
     * However, because of restrictions with Orion, we chose a key-value structure and this is not supported by MongoDB.
     * --COUNT SPACES PER AREA
     * --COUNT OCCUPIED SPACES PER AREA
     * --PERCENTAGE GLOBAL FREE SPACES
     * @returns {string}
     */
    'aggregateParking'(){
        var parkingAreas = collectionWrapper['ParkingArea'].find().fetch();
        var spaceCounts = {total: 0};
        var occupiedCounts = {total: 0};
        for(areaKey in parkingAreas){
            var area = parkingAreas[areaKey];
            spaceCounts[areaKey] = 0;
            occupiedCounts[areaKey] = 0;
            for(lotKey in area.parkingLots){
                var lot = area.parkingLots[lotKey];
                for(spaceKey in lot.parkingSpaces){
                    var space = lot.parkingSpaces[spaceKey];
                    if(space.attributes.occupied === "true"){
                        occupiedCounts[areaKey] ++;
                        occupiedCounts['total'] ++;
                    }
                    spaceCounts[areaKey] ++;
                    spaceCounts['total'] ++;space
                }
            }
        }
        return {spaces: spaceCounts, occupied: occupiedCounts};
    }
})

export {ParkingAreaPull, ParkingLotPull, ParkingSpacePull}