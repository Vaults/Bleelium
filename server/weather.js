import {HTTP} from 'meteor/http';
import {postOrionData} from '/server/imports/orionAPI.js';
import {collectionWrapper} from '/server/imports/collections.js';
import {rewriteAttributes, handleError, rewriteNumbersToObjects} from '/server/imports/util.js';

var dataWeatherMap = {
	"2750953": "Mensfort",
	"2756253": "Eindhoven",
	"2745706": "Veldhoven",
	"2754447": "Helmond",
	"2759794": "Amsterdam"
}
/**
 * @summary Creates orion-compliant weatherstaion object for Orion storage
 * @param {json} o - The JSON object of a weatherstation from OpenWeatherMap
 * @return The orion-compliant weatherstation object
 */
var createWeatherData = function(o){
	return {
		"contextElements": [
			{
				"type": "WeatherStation",
				"isPattern": "false",
				"id": o.id,
				"attributes": [
					{
						"name": "name",
						"type": "string",
						"value": o.name
					},
					{
						"name": "location",
						"type": "string",
						"value": o.name,
					},
					{
						"name": "coord_lon",
						"type": "float",
						"value": o.coord.lon
					},
					{
						"name": "coord_lat",
						"type": "float",
						"value": o.coord.lat
					},
					{
						"name": "weather_main",
						"type": "string",
						"value": o.weather[0].main
					},
					{
						"name": "weather_description",
						"type": "string",
						"value": o.weather[0].description
					},
					{
						"name": "weather_icon",
						"type": "string",
						"value": o.weather[0].icon
					},
					{
						"name": "temp",
						"type": "float",
						"value": o.main.temp
					},
					{
						"name": "pressure",
						"type": "float",
						"value": o.main.pressure
					},
					{
						"name": "humidity",
						"type": "float",
						"value": o.main.humidity
					},
					{
						"name": "temp_min",
						"type": "float",
						"value": o.main.temp_min
					},
					{
						"name": "temp_max",
						"type": "float",
						"value": o.main.temp_max
					},
					{
						"name": "wind_speed",
						"type": "float",
						"value": o.wind.speed
					},
					{
						"name": "wind_deg",
						"type": "float",
						"value": o.wind.deg
					},
					{
						"name": "country",
						"type": "string",
						"value": o.sys.country
					},
					{
						"name": "sunrise",
						"type": "int",
						"value": o.sys.sunrise
					},
					{
						"name": "sunset",
						"type": "int",
						"value": o.sys.sunset
					}
				]
			}
		],
		"updateAction": "APPEND"
	};
}
/**
 * @summary Creates orion-compliant forecast object for Orion storage
 * @param {json} o - The JSON object of a weatherstation from OpenWeatherMap
 * @param {int} i - Represents the number of days between the current date and the forecast date
 * @param {int} id - The id of the weatherstation in question
 * @return The orion-compliant forecast object
 */
var createForecastData = function(o, i, id){
	return {
		"contextElements": [
			{
				"type": "WeatherStation",
				"isPattern": "false",
				"id": id,
				"attributes": [
					{
						"name": i + '-' + 'timestamp',
						"type": "string",
						"value": o.dt
					},
					{
						"name": i + '-' + 'pressure',
						"type": "string",
						"value": o.pressure
					},
					{
						"name": i + '-' + 'humidity',
						"type": "string",
						"value": o.humidity
					},
					{
						"name": i + '-' + 'icon',
						"type": "string",
						"value": o.weather[0]['icon']
					},
					{
						"name": i + '-' + 'deg',
						"type": "string",
						"value": o.deg
					},
					{
						"name": i + '-' + 'min',
						"type": "string",
						"value": o.temp.min
					},
					{
						"name": i + '-' + 'max',
						"type": "string",
						"value": o.temp.max
					},

				]
			}
		],
		"updateAction": "APPEND"
	};
}
/**
 * @summary Sends all data pulled from OpenWeatherMap to Orion
 */
var pushWeatherToOrion = function () {
	var locations = '';
	for (key in dataWeatherMap) {
		if (!locations) {
			var locations = key;
		}
		else {
			locations = locations + ',' + key
		}
	}
	HTTP.call('GET', "http://api.openweathermap.org/data/2.5/group?appid=ec57dc1b5b186be9c7900a63a3e34066&id=" + locations + "&units=metric", {}, handleError(function(response){
		for (i = 0; i < response.data.cnt; i++) {
			postOrionData(createWeatherData(response.data.list[i]));
		}
	}));
}

/**
 * @summary Sends all forecast data pulled from OpenWeatherMap to Orion
 */
var pushForecastToOrion = function(){
	for(id in dataWeatherMap){
		HTTP.call('GET', "http://api.openweathermap.org/data/2.5/forecast/daily?appid=ec57dc1b5b186be9c7900a63a3e34066&id=" + id + "&units=metric", {}, handleError(function(response){
			for (i = 1; i < response.data.list.length; i++) {
				postOrionData(createForecastData(response.data.list[i], i, response.data.city.id));
			}
		}));
	}
}

/**
 * @summary Cronjob for pushing weather to orion, calls pushWeatherToOrion every 30 minutes
 */
SyncedCron.add({
	name: 'Pushing weather to Orion',
	schedule: function (parser) {
		return parser.text('every 30 minutes');
	},
	job: pushWeatherToOrion
});

/**
 * @summary Cronjob for pushing weather forecast to orion, calls pushWeatherToOrion every 6 hours
 */
SyncedCron.add({	//calls pushForecastToOrion every 30 mins
	name: 'Pushing forecast to Orion',
	schedule: function (parser) {
		return parser.text('every 6 hours');
	},
	job: pushForecastToOrion
});


/**
 * @summary Defines the variables for the weather pull, containing the name, arguments and the callback function.
 * @var {array} - weatherPull
 */
var weatherPull = {
	name: 'WeatherStation',
	args: '',
	f: function(args){
		var temp = rewriteAttributes(args);
		rewriteNumbersToObjects(temp).data.contextResponses.forEach(function(o){
			var obj = o.contextElement;
			collectionWrapper['WeatherStation'].upsert({_id: obj._id}, {$set: obj});
		});
	}
}

//exports for tests
export {dataWeatherMap, createWeatherData, createForecastData, pushWeatherToOrion, pushForecastToOrion, weatherPull}
