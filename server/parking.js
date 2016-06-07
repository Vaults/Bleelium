/**
 * Created by s126763 on 7-6-2016.
 */
import {HTTP} from 'meteor/http';
import {postOrionData} from '/server/imports/orionAPI.js';
import {collectionWrapper} from '/server/imports/collections.js';
import {rewriteAttributes, handleError} from '/server/imports/util.js';
import {createP2000Data} from '/server/P2000DataSplitter.js';
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
            var obj = args.data.contextResponses[item].contextElement;
            collectionWrapper['ParkingSpace'].upsert({_id: obj._id}, {$set: obj});
        }
    }
};

export {ParkingAreaPull, ParkingLotPull, ParkingSpacePull}