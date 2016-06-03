import {HTTP} from 'meteor/http';
import {postOrionData} from '/server/imports/orionAPI.js';
import {collectionWrapper} from '/server/imports/collections.js';
import {rewriteAttributes, handleError, rewriteNumbersToObjects} from '/server/imports/util.js';

var bounds = {
	"Acetone" : {lel: 2.15, uel: 13.0},
    "Acetylene" : {lel: 2.5, uel: 100.0},
    "Benzene" : {lel: 1.2, uel: 8.0},
    "Butadiene" : {lel: 1.1, uel: 12.5},
    "Ethane" : {lel: 3.0, uel: 15.5},
    "Ethyl_Alcohol" : {lel: 3.3, uel: 19.0},
    "Ethyl_Ether" : {lel: 1.7, uel: 36.0},
    "Ethylene" : {lel: 2.7, uel: 36.0},
    "Hexane" : {lel: 1.1, uel: 7.5},
    "Hydrogen" : {lel: 4.0, uel: 75.6},
    "IsoButane" : {lel: 1.8, uel: 8.5},
    "Isopropyl_Alcohol" : {lel: 2.0, uel: 12.7},
    "Methane" : {lel: 5.0, uel: 15.0},
    "Methanol" : {lel: 6.0, uel: 36.0},
    "Pentane" : {lel: 1.5, uel: 7.8},
    "Propylene" : {lel: 2.0, uel: 11.1},
    "Toluene" : {lel: 1.2, uel: 7.0},
};

var criticalEventPush = function(o, ins) {
    collectionWrapper['criticalEvents'].upsert({_id: (o.contextElement.type + o.contextElement._id)}, {$set: ins});
}

var gasSensorPull = {
	name: 'GasSensor',
	args: '',
	f: function(args){
		var temp = rewriteAttributes(args);
		temp.data.contextResponses.forEach(function(o){
            var gases = {};
			var obj = o.contextElement.attributes;
            for (var prop in obj) {
                if(!(prop == "coord_lat" || prop == "coord_lon" || prop == "updated_at")) {
                    if(obj[prop] >= bounds[prop].lel && obj[prop] <= bounds[prop].uel) {
                        gases[prop] = obj[prop];
                    }
                }
            }
            if(Object.keys(gases).length > 0) {
                var ins = {type: "Gas", coord_lng: obj.coord_lon, coord_lat: obj.coord_lat, dt: obj.updated_at + '000', gases: gases};
                criticalEventPush(o, {attributes: ins});
            }
		});
	}
}

var smokeSensorPull = {
	name: 'SmokeSensor',
	args: '',
	f: function(args){
		var temp = rewriteAttributes(args);
		temp.data.contextResponses.forEach(function(o){
			var obj = o.contextElement.attributes;
            if(obj.smoke > 0) {
                    var ins = {type: "Smoke", coord_lng: obj.coord_lon, coord_lat: obj.coord_lat, dt: obj.updated_at + '000', smoke: obj.smoke};
                    criticalEventPush(o, {attributes: ins});
            }
		});
	}
}

export {bounds, gasSensorPull, smokeSensorPull}
