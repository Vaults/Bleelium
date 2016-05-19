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


/* https://github.com/percolatestudio/meteor-synced-cron */
SyncedCron.add({
    name: 'Collect the OpenWeatherMap data and store it into orion',
    schedule: function (parser) {
        // parser is a later.parse object
        return parser.text('every 20 seconds');
    },
    job: function () {
        var update = function (locations) {
            HTTP.call('GET', "http://api.openweathermap.org/data/2.5/group?appid=ec57dc1b5b186be9c7900a63a3e34066&id=" + locations + "&units=metric", {}, function (error, response) {
                if (error) {
                    console.log(error);
                } else {
                    for (i = 0; i < response.data.cnt; i++) {
                        var weatherdata = {
                            "contextElements": [
                                {
                                    "type": "WeatherStation",
                                    "isPattern": "false",
                                    "id": response.data.list[i].id,
                                    "attributes": [
                                        {
                                            "name": "name",
                                            "type": "string",
                                            "value": response.data.list[i].name
                                        },
                                        {
                                            "name": "location",
                                            "type": "string",
                                            "value": response.data.list[i].name,
                                        },
                                        {
                                            "name": "coord_lon",
                                            "type": "float",
                                            "value": response.data.list[i].coord.lon
                                        },
                                        {
                                            "name": "coord_lat",
                                            "type": "float",
                                            "value": response.data.list[i].coord.lat
                                        },
                                        {
                                            "name": "weather_main",
                                            "type": "string",
                                            "value": response.data.list[i].weather[0].main
                                        },
                                        {
                                            "name": "weather_description",
                                            "type": "string",
                                            "value": response.data.list[i].weather[0].description
                                        },
                                        {
                                            "name": "weather_icon",
                                            "type": "string",
                                            "value": response.data.list[i].weather[0].icon
                                        },
                                        {
                                            "name": "temp",
                                            "type": "float",
                                            "value": response.data.list[i].main.temp
                                        },
                                        {
                                            "name": "pressure",
                                            "type": "float",
                                            "value": response.data.list[i].main.pressure
                                        },
                                        {
                                            "name": "humidity",
                                            "type": "float",
                                            "value": response.data.list[i].main.humidity
                                        },
                                        {
                                            "name": "temp_min",
                                            "type": "float",
                                            "value": response.data.list[i].main.temp_min
                                        },
                                        {
                                            "name": "temp_max",
                                            "type": "float",
                                            "value": response.data.list[i].main.temp_max
                                        },
                                        {
                                            "name": "wind_speed",
                                            "type": "float",
                                            "value": response.data.list[i].wind.speed
                                        },
                                        {
                                            "name": "wind_deg",
                                            "type": "float",
                                            "value": response.data.list[i].wind.deg
                                        },
                                        {
                                            "name": "country",
                                            "type": "string",
                                            "value": response.data.list[i].sys.country
                                        },
                                        {
                                            "name": "sunrise",
                                            "type": "int",
                                            "value": response.data.list[i].sys.sunrise
                                        },
                                        {
                                            "name": "sunset",
                                            "type": "int",
                                            "value": response.data.list[i].sys.sunset
                                        }
                                    ]
                                }
                            ],
                            "updateAction": "APPEND"
                        };

                        /* proof that OpenWeatherMap is messing up
                         console.log(response.data);
                         console.log('weatherdata:', loc, id, weatherdata.contextElements[0].attributes[0], weatherdata.contextElements[0].attributes[7], response.data.main.temp, response.data.name);
                         */

                        HTTP.call('POST', 'http://131.155.70.152:1026/v1/updateContext', {data: weatherdata}, function (error2, response2) {
                            if (error2) {
                                console.log(error2);
                            }
                        });
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
});


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

Meteor.methods({
    'findWindDir': function (degrees) {
            var min = 360;
            var answer = '';

            for(var key in WIND_DIR){
                if ((Math.abs(degrees - (WIND_DIR[key].deg)) < min)) {
                    min = degrees - WIND_DIR[key].deg;
                    answer = WIND_DIR[key].name;
                }
            }
            return answer;
        }
})

if (!Meteor.isTest) {
    SyncedCron.start();
    reloadPull();
}


//exports for tests
export {pull}
export {dataIDmap}