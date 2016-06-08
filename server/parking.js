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

// for (space in parkingSpace) {
//     var mod = {$set: {}}
//     mod['$set']["parkingLots." + parkingSpace[space].contextElement.attributes.lotId + ".parkingSpaces." + parkingSpace[space].contextElement._id] = parkingSpace[space].contextElement;
//     var lot = collectionWrapper['parkingArea'].find({_id: parkingSpace[space].contextElement._id});
//     collectionWrapper['ParkingArea'].update({_id: lot.attributes.garageId}, mod);

export {ParkingAreaPull, ParkingLotPull, ParkingSpacePull}