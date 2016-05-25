import { Meteor } from 'meteor/meteor';
import { assert } from 'meteor/practicalmeteor:chai';
import { collectionWrapper } from '/server/imports/collections.js';
import {P2000Pull} from '/server/P2000.js';
import {pull} from '/server/imports/orionAPI.js'
import {handleError} from '/server/imports/util.js'
//to be tested functions
import {initPulls} from '/server/main.js';

import {dataWeatherMap} from '/server/weather.js';



describe('initPulls()', function(done) {
	before(function(){
		collectionWrapper["P2000"].remove({});
		collectionWrapper["WeatherStation"].remove({});
		initPulls();
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
			assert.equal(WeatherS   tations.find().count(), c);
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
	after(function(){
		collectionWrapper["P2000"].remove({});
		collectionWrapper["WeatherStation"].remove({});
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