import { Meteor } from 'meteor/meteor';
import { assert } from 'meteor/practicalmeteor:chai';
import { Mongo } from 'meteor/mongo';
import { collectionWrapper } from '/server/imports/collections.js';

//to be tested functions
import {createWeatherData, pushWeatherToOrion, weatherQuery, dataWeatherMap} from '/server/main.js';
import {pull} from '/server/imports/orionAPI.js';

describe('pull("WeatherStations", weatherQuery)', function() {

	it('correctly adds all weatherstations to the database within 1 second.', function(){
		pull("WeatherStations", weatherQuery);
		//var len = Object.keys(dataWeatherMap).length;
		var c = 0;
		Meteor.setTimeout(function(){
			for(key in dataWeatherMap){
				assert.isTrue(WeatherStations.findOne({"id": key})); //checks if all entries in dataWeatherMap exist
				c++;
			}
			assert.isFalse(WeatherStations.findOne({"id": -1})); //checks if it doesn't always return true for non-existing values
			assert.equal(WeatherStations.find().count(), c);
		}, 1000);
	});
	
	it('simple functionality test, assert true = true', function(){
		assert.equal(true,true);
	});
});
describe('createWeatherData()', function(){
	//no tests yet
});
describe('pushWeatherToOrion()', function(){
	//no tests yet
});
describe('findWindDir()', function(){
	it('converts degrees properly', function(){
		//no tests yet
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