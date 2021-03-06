import { Meteor } from 'meteor/meteor';
import { assert } from 'meteor/practicalmeteor:chai';
import { collectionWrapper } from '/server/imports/collections.js';
import {P2000Pull} from '/server/P2000.js';
import {pull} from '/server/imports/orionAPI.js'
import {handleError} from '/server/imports/util.js'
import {SoundDataPull} from "/server/soundSensor.js";
//to be tested functions
import {initPulls} from '/server/main.js';
import {dataWeatherMap} from '/server/weather.js';
import {bounds, gasSensorPull, smokeSensorPull} from '/server/criticalEvents.js';
import {ParkingAreaPull, countParking} from "/server/parking.js";
import {isEqual} from '/server/imports/util.js';


describe('initPulls()', function(done) {
	before(function(done){
        this.timeout(30000);
        collectionWrapper["P2000"].remove({});
        collectionWrapper["ParkingArea"].remove({});
        collectionWrapper["ParkingLot"].remove({});
        collectionWrapper["WeatherStation"].remove({});
        collectionWrapper["criticalEvents"].remove({});
        collectionWrapper["SoundSensor"].remove({});
        initPulls();
        Meteor.setTimeout(function(){done()}, 25000);
	});
	it('adds all weatherstations to the database and not any more', function(done){
		//var len = Object.keys(dataWeatherMap).length;
		var WeatherStations = collectionWrapper['WeatherStation'];
		var c = 0;
		Meteor.setTimeout(function(){
			for(key in dataWeatherMap){
				assert.isDefined(WeatherStations.findOne({"_id": key})); //checks if all entries in dataWeatherMap exist
				c++;
			}
			assert.isUndefined(WeatherStations.findOne({"_id": -1})); //checks if it doesn't always return true for non-existing values
			assert.equal(WeatherStations.find().count(), c);
			done();
		}, 1000);
	});
	it('adds all P2000 items to the database', function(done){
        Meteor.setTimeout(function(){
            pull(P2000Pull.name, P2000Pull.args, handleError(function(response){
                assert.equal(collectionWrapper['P2000'].find().count(), response.data.contextResponses.length);
                done();
            }));
        }, 1000);
	});
	it('adds all GasSensor items to the database', function(done){
		Meteor.setTimeout(function(){
			pull(gasSensorPull.name, gasSensorPull.args, handleError(function(response){
                var count = 0;
                response.data.contextResponses.forEach(function(o){
                    var obj = o.contextElement;
                    for (var i = 0; i < 17; i++) {
                        if(obj.attributes[i].value >= bounds[obj.attributes[i].name].lel && obj.attributes[i].value <= bounds[obj.attributes[i].name].uel) {
                            count++;
                            break;
                        }
                    }
        		});
                assert.equal(collectionWrapper['criticalEvents'].find({'attributes.type': 'Gas'}).count(), count);
				done();
			}));
		}, 1000);
	});
    it('adds all SmokesSensor items to the database', function(done){
        Meteor.setTimeout(function(){
            pull(smokeSensorPull.name, smokeSensorPull.args, handleError(function(response){
                var count = 0;
                response.data.contextResponses.forEach(function(o){
                    var obj = o.contextElement;
                    var attr = lodash.find(obj.attributes, function(o){return o.name === 'smoke'});
                    if(attr.value > 0) {
                        count++;
                    }
                });
                assert.equal(collectionWrapper['criticalEvents'].find({'attributes.type': 'Smoke', 'attributes.smoke' : {$gt: "0"}}).count(), count);
                done();
            }));
        }, 1000);
    });
    it('adds all SoundSensor items to the database', function(done){
        Meteor.setTimeout(function(){
            pull(SoundDataPull.name, SoundDataPull.args, handleError(function(response){
                assert.equal(collectionWrapper['SoundSensor'].find().count(), response.data.contextResponses.length);
                done();
            }));
        }, 1000);
    });
    it('adds all ParkingArea, Lots & Spaces items to the database', function(done){
        Meteor.setTimeout(function(){
            pull(ParkingAreaPull.name, ParkingAreaPull.args, handleError(function(response){
                assert.equal(collectionWrapper['ParkingArea'].find().count(), response.data.contextResponses.length);
                done();
            }));
        }, 1000);
    });
    it('Counts occupancy properly', function(done){
        Meteor.setTimeout(function(){
            var res = countParking();
            var comp = { spaces: { '1': 498, '2': 240, '3': 120, total: 858 },
				occupied: { '1': 265, '2': 110, '3': 61, total: 436 } };
            assert.isTrue(isEqual(res.spaces,comp.spaces));
            assert.isTrue(isEqual(res.occupied,comp.occupied));
            done();
        }, 1000);
    });
	after(function(){
		collectionWrapper["P2000"].remove({});
		collectionWrapper["ParkingArea"].remove({});
		collectionWrapper["ParkingLot"].remove({});
		collectionWrapper["WeatherStation"].remove({});
        collectionWrapper["criticalEvents"].remove({});
		collectionWrapper["SoundSensor"].remove({});
	});
});

/*
 var tests = [
   {args: [1, 2],       expected: 3},
   {args: [1, 2, 3],    expected: 6},
   {args: [1, 2, 3, 4], expected: 10},
 ];

 tests.forEach(function(test) {
   it('correctly adds ' + test.args.length + ' args', function() {
     var res = add.apply(null, test.args);
     assert.equal(res, test.expected);
   });
 });
 */
