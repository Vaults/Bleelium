import { HTTP } from 'meteor/http';
import { EJSON } from 'meteor/ejson';
import { Mongo } from 'meteor/mongo';

WeatherStations = new Mongo.Collection('weatherStations');

Meteor.publish('weatherPub', function weatherPublication(){
  return WeatherStations.find({});
})

/* https://github.com/percolatestudio/meteor-synced-cron */
SyncedCron.add({
  name: 'Collect the OpenWeatherMap data and store it into orion',
  schedule: function(parser) {
    // parser is a later.parse object
    return parser.text('every 20 seconds');
  },
  job: function() {
    console.log("updated");
    HTTP.call( 'GET', 'http://api.openweathermap.org/data/2.5/weather?appid=ec57dc1b5b186be9c7900a63a3e34066&q=Eindhoven&units=metric', { }, function( error, response ) {
        if ( error ) {
            console.log( error );
        } else {
      console.log(response.data.name);
      var clone = JSON.parse(JSON.stringify(response.data)); //clone response.data
      var weatherdata =  {
                "contextElements": [
                    {
                        "type": "WeatherStation",
                        "isPattern": "false",
                        "id": "2750953",
                        "attributes": [
                            {
                            "name": "name",
                                    "type": "string",
                                    "value": clone.name
                            },
                            {
                            "name": "location",
                                    "type": "string",
                                    "value": "Eindhoven"
                            },
                            {
                            "name": "coord_lon",
                                    "type": "float",
                                    "value": clone.coord.lon
                            },
                            {
                            "name": "coord_lat",
                                    "type": "float",
                                    "value": clone.coord.lat
                            },
                            {
                            "name": "weather_main",
                                    "type": "string",
                                    "value": clone.weather.main
                            },
                            {
                            "name": "weather_description",
                                    "type": "string",
                                    "value": clone.weather.description
                            },
                            {
                            "name": "weather_icon",
                                    "type": "string",
                                    "value": clone.weather.icon
                            },
                            {
                            "name": "temp",
                                    "type": "float",
                                    "value": clone.main.temp
                            },
                            {
                            "name": "pressure",
                                    "type": "float",
                                    "value": clone.main.pressure
                            },
                            {
                            "name": "humidity",
                                    "type": "float",
                                    "value": clone.main.humidity
                            },
                            {
                            "name": "temp_min",
                                    "type": "float",
                                    "value": clone.main.temp_min
                            },
                            {
                            "name": "temp_max",
                                    "type": "float",
                                    "value": clone.main.temp_max
                            },
                            {
                            "name": "wind_speed",
                                    "type": "float",
                                    "value": clone.wind.speed
                            },
                            {
                            "name": "wind_deg",
                                    "type": "float",
                                    "value": clone.wind.deg
                            },
                            {
                            "name": "country",
                                    "type": "string",
                                    "value": clone.sys.country
                            },
                            {
                            "name": "sunrise",
                                    "type": "int",
                                    "value": clone.sys.sunrise
                            },
                            {
                            "name": "sunset",
                                    "type": "int",
                                    "value": clone.sys.sunset
                            }
                        ]
                    }
                  ],
                    "updateAction": "APPEND"
                };
            HTTP.call( 'POST', 'http://131.155.70.152:1026/v1/updateContext',
            {data: weatherdata},
            function( error2, response2 ) {
                if ( error2 ) {
                    console.log( error2 );
                } else {
                    console.log( response2 );
                }
            });
        }
    });

  }
});

SyncedCron.start();

HTTP.call( 'POST', 'http://131.155.70.152:1026/v1/queryContext', {
    data: {
        "entities": [
            {
                "type": "WeatherStation",
                "isPattern": "false",
                "id": "2750953"
            }
        ]
    }
}, function( error, response ) {
    if ( error ) {
        console.log( error );
    } else {
        WeatherStations.remove({});
        var attributesToKeyValue= function(attr){
        	var temp = {}
        	attr.forEach(function(o){
        		temp[o.name] = o.value;
        	});
        	return temp;
        }
        var rewriteAttributes = function(obj){
        	obj.data.contextResponses[0].contextElement.attributes = attributesToKeyValue(	obj.data.contextResponses[0].contextElement.attributes);
          return obj;
        }
        json = rewriteAttributes(response);
        WeatherStations.insert(json.data.contextResponses[0].contextElement);
    }
});
