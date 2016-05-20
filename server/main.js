import {HTTP} from 'meteor/http';
import {EJSON} from 'meteor/ejson';
import {Mongo} from 'meteor/mongo';
import {WIND_DIR} from './windDirections.js';
import {postOrionData, pull, reloadPull, initQuery} from '/server/imports/orionAPI.js';
import {collectionWrapper} from '/server/imports/collections.js';
<<<<<<< HEAD
import {rewriteAndInsertAttributes} from '/server/imports/util.js';
=======
import {rewriteAttributes} from '/server/imports/util.js';
>>>>>>> cc38db73aba6da55093e68c9d0d0e2e6d850dbf9

var dataWeatherMap = {
	"2750953": "Mensfort",
	"2756253": "Eindhoven",
	"2745706": "Veldhoven",
	"2754447": "Helmond",
	"2759794": "Amsterdam"
}
var weatherQuery = initQuery("WeatherStation", dataWeatherMap);

var createWeatherData = function(o){ //Creates orion-compliant objects for Orion storage
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
						"value": o.weather.icon
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

var pushWeatherToOrion = function () { //Sends all data pulled from OpenWeatherMap to Orion
    var update = function (locationString, locs) {
        HTTP.call('GET', "http://api.openweathermap.org/data/2.5/group?appid=ec57dc1b5b186be9c7900a63a3e34066&id=" + locations + "&units=metric", {}, function (error, response) {
            if (error) {
                console.log(error);
            } else {
                for (i = 0; i < response.data.cnt; i++) {
					postOrionData(createWeatherData(response.data.list[i]));  
                }
<<<<<<< HEAD
				for(var j = 0; j < locs.length; j++){
					var loc = locs[j];
=======
				while(locs.length > 0){
					var loc = locs.pop();
>>>>>>> cc38db73aba6da55093e68c9d0d0e2e6d850dbf9
					HTTP.call('GET', "http://api.openweathermap.org/data/2.5/forecast/daily?appid=ec57dc1b5b186be9c7900a63a3e34066&id=" + loc + "&units=metric", {}, function (error, response) {
						if (error) {
							console.log(error);
						} else {
							for (i = 1; i < response.data.list.length; i++) {
<<<<<<< HEAD
								postOrionData(createForecastData(response.data.list[i], i, loc), function(e, r){

									var util = require('util');

								});
=======
								
								postOrionData(createForecastData(response.data.list[i], i, response.data.city.id));  
>>>>>>> cc38db73aba6da55093e68c9d0d0e2e6d850dbf9
							}
						}
					});
				}
            }

        });

	}
	var locs = [];
	var locations = '';
	for (key in dataWeatherMap) {
		locs.push(key);
		if (!locations) {
			var locationString = key;
		}
		else {
			locationString = locationString + ',' + key
		}
	}
    update(locationString, locs);
}

<<<<<<< HEAD
var createP2000Data = function(o){ //Creates orion-compliant objects for Orion storage
	return {
		"contextElements": [
			{
				"type": "P2000",
				"isPattern": "false",
				"id": o.guid[0]._,
				"attributes": [
          {
            "name": "title",
            "type": "string",
            "value": o.title[0]
          },
          {
            "name": "description",
            "type": "string",
            "value": o.description[0].replace(/\<(.*?)\>/g, '').replace('(', '').replace(')', '')
          },
					{
						"name": "publish_date",
						"type": "string",
						"value": o.pubDate[0]
					}
				]
			}
		],
		"updateAction": "APPEND"
	};
}
var pushP2000ToOrion = function() {
  HTTP.call('GET', 'http://feeds.livep2000.nl/?r=22&d=1,2,3', function(error, response) {
    if (error) {
        console.log(error);
    } else {
      xml2js.parseString(response.content, function (err, result) {
        for(item in result.rss.channel[0].item) {
          data = createP2000Data(result.rss.channel[0].item[item]);
          HTTP.call('POST', 'http://131.155.70.152:1026/v1/updateContext', {data: data}, function(error, response) {
            if (error) {
                console.log(error);
            } else {
              }
          });
        }
        var collection = collectionWrapper['P2000'];
        HTTP.call('GET', 'http://131.155.70.152:1026/v1/contextEntityTypes/P2000', function (error, response) {
            if (error) {
                console.log(error);
            } else {
              console.log(rewriteAndInsertAttributes(response));
            }
        });

      });
    }
  });
}

=======
>>>>>>> cc38db73aba6da55093e68c9d0d0e2e6d850dbf9
/* https://github.com/percolatestudio/meteor-synced-cron */
SyncedCron.add({	//calls pushWeatherToOrion every 30 mins
    name: 'Pushing weather to Orion',
    schedule: function (parser) {
        return parser.text('every 30 minutes');
    },
    job: pushWeatherToOrion
});

var numToObj = function(o){
	o.forecast = {};
	for(key in o){
		var fc = key.charAt(0);
        if(fc >= 0 && fc <= 9){
			if(!o.forecast['day' + fc]){
				o.forecast['day' + fc] = {}
			}
			o.forecast['day' + fc][key.substr(2,key.length)] = o[key];
 			delete o[key];
		}
    } 
    return o;
}

var rewriteNumbersToObjects = function(obj){
	for (var i = 0; i < obj.data.contextResponses.length; i++) {
		var tempobj = obj.data.contextResponses[i].contextElement;
		tempobj.attributes = numToObj(tempobj.attributes);
	}
	return obj;
}


if (!Meteor.isTest) { //only polls data getting/setting if the system is not in test mode
    SyncedCron.start();
<<<<<<< HEAD
	//reloadPull("WeatherStations", weatherQuery, function(args){
	//	collectionWrapper['WeatherStations'].remove({});
		//console.log(args.data.contextResponses);
	//});
=======
	reloadPull("WeatherStations", weatherQuery, function(args){
		collectionWrapper['WeatherStations'].remove({});
		var temp = rewriteAttributes(args);
		//console.log(args.data);
		//console.log(rewriteNumbersToObjects(temp).data.contextResponses[0].contextElement.attributes.forecast.day1);
		rewriteNumbersToObjects(temp).data.contextResponses.forEach(function(o){
			collectionWrapper['WeatherStations'].insert(o.contextElement);
		});
	});
>>>>>>> cc38db73aba6da55093e68c9d0d0e2e6d850dbf9
}


//exports for tests
export {createWeatherData, pushWeatherToOrion, weatherQuery, dataWeatherMap}