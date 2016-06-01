import {HTTP} from 'meteor/http';
import {postOrionData} from '/server/imports/orionAPI.js';
import {collectionWrapper} from '/server/imports/collections.js';
import {rewriteAttributes, handleError, rewriteNumbersToObjects} from '/server/imports/util.js';

var lel = {
	"Acetone" : 2.15,
    "Acetylene" : 2.5,
    "Benzene" : 1.2,
    "Butadiene" : 1.1,
    "Ethane" : 3.0,
    "Ethyl_Alcohol" : 3.3,
    "Ethyl_Ether" : 1.7,
    "Ethylene" : 2.7,
    "Hexane" : 1.1,
    "Hydrogen" : 4.0,
    "IsoButane" : 1.8,
    "Isopropyl_Alcohol" : 2.0,
    "Methane" : 5.0,
    "Methanol" : 6.0,
    "Pentane" : 1.5,
    "Propylene" : 2.0,
    "Toluene" : 1.2,
};

var uel = {
	"Acetone" : 13.0,
    "Acetylene" : 100,
    "Benzene" : 8.0,
    "Butadiene" : 12.5,
    "Ethane" : 15.5,
    "Ethyl_Alcohol" : 19.0,
    "Ethyl_Ether" : 36.0,
    "Ethylene" : 36.0,
    "Hexane" : 7.5,
    "Hydrogen" : 75.6,
    "IsoButane" : 8.5,
    "Isopropyl_Alcohol" : 12.7,
    "Methane" : 15.0,
    "Methanol" : 36.0,
    "Pentane" : 7.8,
    "Propylene" : 11.1,
    "Toluene" : 7.0,
};

var gasSensorPull = {
	name: 'GasSensor',
	args: '',
	f: function(args){
		var temp = rewriteAttributes(args);
		temp.data.contextResponses.forEach(function(o){
			var obj = o.contextElement.attributes;
            for (var prop in obj) {
                if(!(prop == "coord_lat" || prop == "coord_lon" || prop == "updated_at")) {
                    if(obj[prop] >= lel[prop] && obj[prop] <= uel[prop]) {
                        var ins = {type: "Gas", data: obj};
                        collectionWrapper['criticalEvents'].upsert({_id: (o.contextElement.type + o.contextElement._id)}, {$set: ins});
                    }
                    else {
                    }
                }
            }

		});
	}
}

export {gasSensorPull}
