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
var pushWeatherToOrion = function () { //Sends all data pulled from OpenWeatherMap to Orion
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
                console.log(response);
              }
          });
        }
      });
    }
  });
}

/* https://github.com/percolatestudio/meteor-synced-cron */
SyncedCron.add({	//calls pushWeatherToOrion every 30 mins
    name: 'Pushing weather to Orion',
    schedule: function (parser) {
        return parser.text('every 30 minutes');
    },
    job: pushWeatherToOrion
});

SyncedCron.add({	//calls pushWeatherToOrion every 30 mins
    name: 'Pushing P2000 to Orion',
    schedule: function (parser) {
        return parser.text('every 20 seconds');
    },
    job: pushP2000ToOrion
});

if (!Meteor.isTest) { //only polls data getting/setting if the system is not in test mode
    SyncedCron.start();
	reloadPull("WeatherStations", weatherQuery);
}


//exports for tests
export {createWeatherData, pushWeatherToOrion, weatherQuery, dataWeatherMap}
