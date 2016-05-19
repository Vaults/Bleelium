import { Meteor } from 'meteor/meteor';
import { assert } from 'meteor/practicalmeteor:chai';
import { Mongo } from 'meteor/mongo';
import { collectionWrapper } from '/server/imports/collections.js';

//to be tested functions
import {postOrionData} from '/server/imports/orionAPI.js';

describe('postOrionData()', function(done){
	it('No errors from pulling openweathermap properly', function(done){
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
		postOrionData(postWeatherTest, function(error, result){
			assert.isDefined(result.statusCode);
			assert.equal(result.statusCode, 200);
			done();
		});
	});
	it('Errors when sending false data', function(done){
		var postWeatherTest =  { 
			"bogus": "element"
		}
		postOrionData(postWeatherTest, function(error, result){
			assert.isUndefined(result.data.statusCode);
			assert.isDefined(result.data.errorCode);
			done();
		});
	});
		
});