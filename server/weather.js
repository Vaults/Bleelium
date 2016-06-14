import {HTTP} from 'meteor/http';
import {postOrionData} from '/server/imports/orionAPI.js';
import {collectionWrapper} from '/server/imports/collections.js';
import {
    rewriteAttributes,
    handleError,
    rewriteNumbersToObjects,
    createBoilerplateOrionObject,
    orionBoilerplateAttributePusher
} from '/server/imports/util.js';

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
var createWeatherData = function (o) {
    var orionBoilerplate = createBoilerplateOrionObject("WeatherStation", o.id, "APPEND");
    var attrMap = {
        name: '',
        location: o.name,
        coord_lon: o.coord.lon,
        coord_lat: o.coord.lat,
        weather_main: o.weather[0].main,
        weather_description: o.weather[0].description,
        weather_icon: o.weather[0].icon,
        temp: '',
        pressure: o.main.pressure,
        humidity: o.main.humidity,
        temp_min: o.main.temp_min,
        temp_max: o.main.temp_max,
        wind_speed: o.wind.speed,
        wind_deg: o.wind.deg,
        country: o.sys.country,
        sunrise: o.sys.sunrise,
        sunset: o.sys.sunset
    }
    return orionBoilerplateAttributePusher(orionBoilerplate, o, attrMap);


}
/**
 * @summary Creates orion-compliant forecast object for Orion storage
 * @param {json} o - The JSON object of a weatherstation from OpenWeatherMap
 * @param {int} i - Represents the number of days between the current date and the forecast date
 * @param {int} id - The id of the weatherstation in question
 * @return The orion-compliant forecast object
 */
var createForecastData = function (o, i, id) {
    var orionBoilerplate = createBoilerplateOrionObject("WeatherStation", id, "APPEND");
    var attrMap = {};
    attrMap[i + '-timestamp'] = o.dt;
    attrMap[i + '-pressure'] = o.pressure;
    attrMap[i + '-humidity'] = o.humidity;
    attrMap[i + '-icon'] = o.weather[0]['icon'];
    attrMap[i + '-deg'] = o.deg;
    attrMap[i + '-min'] = o.temp.min;
    attrMap[i + '-max'] = o.temp.max;

    return orionBoilerplateAttributePusher(orionBoilerplate, o, attrMap);
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
    HTTP.call('GET', "http://api.openweathermap.org/data/2.5/group?appid=ec57dc1b5b186be9c7900a63a3e34066&id=" + locations + "&units=metric", {}, handleError(function (response) {
        for (i = 0; i < response.data.cnt; i++) {
            postOrionData(createWeatherData(response.data.list[i]));
        }
    }));
}

/**
 * @summary Sends all forecast data pulled from OpenWeatherMap to Orion
 */
var pushForecastToOrion = function () {
    for (id in dataWeatherMap) {
        HTTP.call('GET', "http://api.openweathermap.org/data/2.5/forecast/daily?appid=ec57dc1b5b186be9c7900a63a3e34066&id=" + id + "&units=metric", {}, handleError(function (response) {
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
        return parser.text('every 10 minutes');
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
    f: function (args) {
        var temp = rewriteAttributes(args);
        rewriteNumbersToObjects(temp).data.contextResponses.forEach(function (o) {
            var obj = o.contextElement;
            collectionWrapper['WeatherStation'].upsert({_id: obj._id}, {$set: obj});
        });
    }
}

//exports for tests
export {dataWeatherMap, createWeatherData, createForecastData, pushWeatherToOrion, pushForecastToOrion, weatherPull}
