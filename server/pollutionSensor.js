import {HTTP} from 'meteor/http';
import {postOrionData} from '/server/imports/orionAPI.js';
import {collectionWrapper} from '/server/imports/collections.js';
import {rewriteAttributes, handleError, rewriteNumbersToObjects} from '/server/imports/util.js';

/**
 * @summary Creates orion-compliant weatherstaion object for Orion storage
 * @param {json} o - The JSON object of a weatherstation from OpenWeatherMap
 * @return The orion-compliant weatherstation object
 */
var createPollutionSensorData = function(o, i){
    return {
        "contextElements": [
            {
                "type": "PollutionSensor",
                "isPattern": "false",
                "id": i,
                "attributes": [
                    {
                        "name": "coord_lat",
                        "type": "float",
                        "value": o.gps.lat
                    },
                    {
                        "name": "coord_lon",
                        "type": "float",
                        "value": o.gps.lon
                    },
                    {
                        "name": "no2",
                        "type": "float",
                        "value": o.NO2
                    },
                    {
                        "name": "ozon",
                        "type": "float",
                        "value": o.OZON
                    },
                    {
                        "name": "pm1",
                        "type": "float",
                        "value": o.PM1
                    },
                    {
                        "name": "pm10",
                        "type": "float",
                        "value": o.PM10
                    },
                    {
                        "name": "pm25",
                        "type": "float",
                        "value": o.PM25
                    },
                    {
                        "name": "updated_at",
                        "type": "string",
                        "value": o.utctimestamp
                    }
                ]
            }
        ],
        "updateAction": "APPEND"
    };
}

/**
 * @summary Sends all data pulled from OpenWeatherMap to Orion
 */
var pushPollutionToOrion = function () {
    count = 1;
    for (var i = 1; i < 41; i++) {
        if (!(i == 5 || i == 23 || i == 32 || i == 33)) {
            HTTP.call('GET', "http://data.aireas.com/api/v1/?airboxid=" + i + ".cal", {}, handleError(function (response) {
                setTimeout(postOrionData(createPollutionSensorData(response.data, count),function(error,response){
                    console.log(response);
                }),500);
                count++;
            }));
        }
        else {
            count++;
        }
    }
}

/**
 * @summary Cronjob for pushing weather forecast to orion, calls pushWeatherToOrion every 6 hours
 */
SyncedCron.add({	//calls pushForecastToOrion every 30 mins
    name: 'Pushing PollutionSensor to Orion',
    schedule: function (parser) {
        return parser.text('every 2 minutes');
    },
    job: pushPollutionToOrion
});