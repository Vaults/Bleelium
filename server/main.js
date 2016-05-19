import {HTTP} from 'meteor/http';
import {EJSON} from 'meteor/ejson';
import {Mongo} from 'meteor/mongo';
import {WIND_DIR} from './windDirections.js';
import {postOrionData, pull, reloadPull, initQuery} from '/server/imports/orionAPI.js';


var dataWeatherMap = {
	"2750953": "Mensfort",
	"2756253": "Eindhoven",
	"2745706": "Veldhoven",
	"2754447": "Helmond",
	"2759794": "Amsterdam"
}
var weatherQuery = initQuery("WeatherStation", dataWeatherMap);

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
var pushWeatherToOrion = function () {
    var update = function (locations) {
        HTTP.call('GET', "http://api.openweathermap.org/data/2.5/group?appid=ec57dc1b5b186be9c7900a63a3e34066&id=" + locations + "&units=metric", {}, function (error, response) {
            if (error) {
                console.log(error);
            } else {
                for (i = 0; i < response.data.cnt; i++) {
					postOrionData(createWeatherData(response.data.list[i]));  
                }
            }
        });
    }

    for (key in dataWeatherMap) {
        if (!locations) {
            var locations = key;
        }
        else {
            locations = locations + ',' + key
        }
    }
    update(locations);
}

/* https://github.com/percolatestudio/meteor-synced-cron */
SyncedCron.add({
    name: 'Pushing weather to Orion',
    schedule: function (parser) {
        return parser.text('every 30 minutes');
    },
    job: pushWeatherToOrion
});

if (!Meteor.isTest) {
    SyncedCron.start();
	reloadPull("WeatherStations", weatherQuery);
}


//exports for tests
export {createWeatherData, pushWeatherToOrion, weatherQuery}