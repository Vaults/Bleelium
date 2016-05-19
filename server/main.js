import {HTTP} from 'meteor/http';
import {EJSON} from 'meteor/ejson';
import {Mongo} from 'meteor/mongo';
import {WIND_DIR} from './windDirections.js';

export const WeatherStations = new Mongo.Collection('weatherStations');
Meteor.publish('weatherPub', function weatherPublication() {
    return WeatherStations.find({});
})

var dataIDmap = {
    "2750953": "Eindhoven",
    "2745706": "Veldhoven",
    "2754447": "Helmond",
    "2759794": "Amsterdam"
}
var query = {data: {entities: []}};
for (key in dataIDmap) {
    query.data.entities.push({
        "type": "WeatherStation",
        "isPattern": "false",
        "id": key
    });
}

var postWeatherData = function(weatherdata, callback){
	HTTP.call('POST', 'http://131.155.70.152:1026/v1/updateContext', {data: weatherdata}, callback);		
}

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

var pushToOrion = function () {
    var update = function (locations) {
        HTTP.call('GET', "http://api.openweathermap.org/data/2.5/group?appid=ec57dc1b5b186be9c7900a63a3e34066&id=" + locations + "&units=metric", {}, function (error, response) {
            if (error) {
                console.log(error);
            } else {
                for (i = 0; i < response.data.cnt; i++) {
					postWeatherData(createWeatherData(response.data.list[i]));  
                }
            }
        });
    }

    for (key in dataIDmap) {
        if (!locations) {
            var locations = key;
        }
        else {
            locations = locations + ',' + key
        }
    }
    update(locations);
}
var pull = function () {

    HTTP.call('POST', 'http://131.155.70.152:1026/v1/queryContext', query, function (error, response) {

        if (error) {
            console.log(error);
        } else {
            WeatherStations.remove({});
            var attributesToKeyValue = function (attr) {
                var temp = {}
                attr.forEach(function (o) {
                    temp[o.name] = o.value;
                });
                return temp;
            }
            var rewriteAndInsertAttributes = function (obj) {
                for (var i = 0; i < obj.data.contextResponses.length; i++) {
                    var tempobj = obj.data.contextResponses[i].contextElement;
                    tempobj.attributes = attributesToKeyValue(tempobj.attributes);
                    WeatherStations.insert(tempobj);
                }
            }
            rewriteAndInsertAttributes(response);
        }
    });
};
var reloadPull = function () {
    pull();
    Meteor.setTimeout(reloadPull, 5000);
}

var Future = Npm.require('fibers/future');

Meteor.methods({
    'findWindDir': function (degrees) {
        //Set up future
        var future = new Future();
        var onComplete = future.resolver();

        var min = 360;
        var answer = '';

        for (var key in WIND_DIR) {
            if ((Math.abs(degrees - (WIND_DIR[key].deg)) < min)) {
                min = degrees - WIND_DIR[key].deg;
                answer = WIND_DIR[key].name;
               // console.log(answer)
            }
        }

        var error = 'ow shit'
        future.resolver(error,answer);

        return future;
        Future.wait(future);
    }
})


/* https://github.com/percolatestudio/meteor-synced-cron */
SyncedCron.add({
    name: 'Collect the OpenWeatherMap data and store it into orion',
    schedule: function (parser) {
        return parser.text('every 30 minutes');
    },
    job: pushToOrion
});
if (!Meteor.isTest) {
    SyncedCron.start();
    reloadPull();
}


//exports for tests
export {dataIDmap, postWeatherData, createWeatherData, pushToOrion, pull}