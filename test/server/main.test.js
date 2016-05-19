import { Meteor } from 'meteor/meteor';
import { assert } from 'meteor/practicalmeteor:chai';
import { Mongo } from 'meteor/mongo';
import {WeatherStations} from '/server/main.js';

//to be tested functions
import {dataIDmap, postWeatherData, createWeatherData, pushToOrion, pull} from '/server/main.js';

console.log("Test loaded.");
function add() {
  return Array.prototype.slice.call(arguments).reduce(function(prev, curr) {
    return prev + curr;
  }, 0);
}

describe('pull()', function() {

	it('correctly adds all weatherstations to the database within 1 second.', function(){
		pull();
		var len = Object.keys(dataIDmap).length;
		Meteor.setTimeout(function(){
			for(key in dataIDmap){
				assert.isTrue(WeatherStations.findOne({"id": key})); //checks if all entries in dataIDmap exist
			}
			assert.isFalse(WeatherStations.findOne({"id": -1})); //checks if it doesn't always return true for non-existing values
		}, 1000);
	});
	
	it('simple functionality test, assert true = true', function(){
		assert.equal(true,true);
	});
});
describe('postWeatherData()', function(){
	it('No errors from pulling openweathermap properly', function(){
		var postWeatherTest =  { 
			contextElements:	[
				{ 
					type: 'WeatherStation',
					isPattern: 'false',
					id: 2750953,
					attributes: [
						{ name: 'name', type: 'string', value: 'Mensfort' },
						{ name: 'location', type: 'string', value: 'Mensfort' },
						{ name: 'coord_lon', type: 'float', value: 5.47 },
						{ name: 'coord_lat', type: 'float', value: 51.45 },
						{ name: 'weather_main', type: 'string', value: 'Clouds' },
						{ name: 'weather_description',
							type: 'string',
							value: 'overcast clouds' },
						{ name: 'weather_icon', type: 'string', value: '04d' },
						{ name: 'temp', type: 'float', value: 16.53 },
						{ name: 'pressure', type: 'float', value: 1012 },
						{ name: 'humidity', type: 'float', value: 59 },
						{ name: 'temp_min', type: 'float', value: 15 },
						{ name: 'temp_max', type: 'float', value: 19.44 },
						{ name: 'wind_speed', type: 'float', value: 2.6 },
						{ name: 'wind_deg', type: 'float', value: 260 },
						{ name: 'country', type: 'string', value: 'NL' },
						{ name: 'sunrise', type: 'int', value: 1463629155 },
						{ name: 'sunset', type: 'int', value: 1463686204 }
					],
				}
			],
			updateAction: 'APPEND' 
		}
		postWeatherData(postWeatherTest, function(error, result){
			assert.equal(result.statusCode, 200);
		});
	});
	it('Errors when sending false data', function(){
		var postWeatherTest =  { 
			"bogus": "element"
		}
		postWeatherData(postWeatherTest, function(error, result){
			assert.notEqual(result.statusCode, 200);
		});
	});
	
});
describe('createWeatherData()', function(){
	//no tests yet
});
describe('pushToOrion()', function(){
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