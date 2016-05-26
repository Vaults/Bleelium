import {MAIN_MODULE} from  './mainModule.js';

MAIN_MODULE.controller('weatherCtrl', function ($scope, $meteor, $reactive, $rootScope, WeatherService, IconService) {

    $meteor.subscribe('weatherPub');
    $scope.markers = [];

    $scope.helpers({	//Scope helpers to get from Meteor collections
        weatherStationDebug(){
            return WeatherStations.findOne({"_id": "2756253"});
        },
        weatherStations(){
            return WeatherStations.find({});
        }
    });

    /**
     * @summary Find a weatherstation based on geolocation
     * @param loc object with attributes 'attributes.coord_lat' and 'attributes.coord_lon'
     * @returns WeatherStation
     */
    $scope.findWeatherStationInfo = function (loc) { //Finds a weather station from coordinates
        var selector = {
            'attributes.coord_lat': String(lodash.round(loc.lat(), 2)),
            'attributes.coord_lon': String(lodash.round(loc.lng(), 2))
        };
        return WeatherStations.findOne(selector);
    }

    /**
     * @summary Updates the scope information when a marker is clicked
     * @param event Marker click event
     * @param arg WeatherStation information
     */
    var setInfo = function (event, arg) { //Updates scope to the current selected weatherstation
        if (arg) {
            var loc = $scope.findWeatherStationInfo(arg);

            $scope.loc = arg;
            WeatherService.weatherLocation = { //Set a global variable with current location
                'attributes.coord_lat': '' + lodash.round(arg.lat(), 2),
                'attributes.coord_lon': '' + lodash.round(arg.lng(), 2)
            };
            $scope.date = loc.attributes.date;
            $scope.name = loc.attributes.name;
            $scope.latitude = lodash.round(arg.lat(), 2);
            $scope.longtitude = lodash.round(arg.lng(), 2);
            $scope.temperature = lodash.round(loc.attributes.temp, 2);
            $scope.min = lodash.round(loc.attributes.temp_min, 2);
            $scope.max = lodash.round(loc.attributes.temp_max, 2);
            $scope.windDegrees = loc.attributes.wind_deg;
            $scope.windDirection = getWindDir(loc.attributes.wind_deg);
            $scope.Airpressure = lodash.round(loc.attributes.pressure);
            $scope.Humidity = lodash.round(loc.attributes.humidity);
            $scope.sunrise = loc.attributes.sunrise;
            $scope.sunset = loc.attributes.sunset;
            $scope.iconURL = IconService.retIconUrl(loc.attributes.weather_icon, 'weather');
            $scope.$apply();
        }
    };

    /**
     * @summary Add a textual description of the wind direction, e.g. NW
     * @param degrees Wind Direction
     * @deprecated unused
     */
    var getWindDir = function (degrees) {	//gets Wind Direction from a degree
        Meteor.call('findWindDir', degrees, function (error, result) {
            if (!error) {
                $scope.windDirection = result;
            }
        })
    }


    //When setInfo is broadcasted, call setInfo function
    $scope.$on('setInfo', setInfo);
    /**
     * @summary Make a location objects with latitude and longitude fields
     * @param latitude
     * @param longitude
     * @returns Object with latitude and longitude
     */
    $scope.makeLocation = function (latitude, longitude) {
        return {
            latitude,
            longitude
        }
    };


    /**
     * @summary Runs whenever weatherstation collection is updated. Pulls weatherstations and updates UI elements accordingly
     */
    var reload = function () {
        $reactive(this).attach($scope);
        var selStation = $scope.getReactively('weatherStationDebug');
        var stations = $scope.getReactively('weatherStations');
        setInfo(null, $scope.loc);
        //Create map and center on Eindhoven
        if (selStation) {
            if (!$scope.map) {
                $scope.map = {
                    center: {
                        longitude: selStation.attributes.coord_lon,
                        latitude: selStation.attributes.coord_lat,
                    },
                    zoom: 11,
                    events: {
                        click: (mapModel, eventName, originalEventArgs) => {
                $scope.$apply();
            }
            },
                options: {
                    disableDefaultUI: true
                }

            };
            }
        }
        //Create map markers for each weatherstation
        $scope.markers = [];
        for (var i = 0; i < stations.length; i++) {
            if (stations[i].attributes) {
                $scope.markers.push({
                    options: {
                        draggable: false,
                        icon: IconService.createMarkerIcon(stations[i].attributes.weather_icon, 'weather')
                    },
                    events: {
                        click: (marker, eventName, args) => {
                            //Set global variable to current weatherstation for use from other controllers
                        $rootScope.$broadcast('setInfo', marker.getPosition());
                }
            },
                location: {
                    longitude: stations[i].attributes.coord_lon,
                        latitude: stations[i].attributes.coord_lat,
                },
            });
            }
        }
    }
    $scope.autorun(reload)


});
/**
 * @summary Controller for the parking tab
 */
MAIN_MODULE.controller('parkingCtrl', function ($scope, $meteor, $reactive) {
    $scope.map = {
        center: {
            longitude: 5.4500238,
            latitude: 51.4523127,
        },
        zoom: 15,
        events: {
            click: (mapModel, eventName, originalEventArgs) => {
    $scope.$apply();
}
},
    options: {
        disableDefaultUI: true
    }
};
});
/**
 * @summary Controller for the forecast tab. Loads the current weatherstation and sets scope variables accordingly
 */
MAIN_MODULE.controller('forecastCtrl', function ($scope, $meteor, $reactive, $rootScope, WeatherService, IconService) {

    $meteor.subscribe('weatherPub');
    //If no location selected, use Eindhoven
    if (WeatherService.weatherLocation == null) {
        WeatherService.weatherLocation = {'attributes.coord_lat': '51.44', 'attributes.coord_lon': '5.48'};
    }

    //Load the name and coordinates for this location
    var loc = WeatherStations.findOne(WeatherService.weatherLocation);

    $scope.name = loc.attributes.name;
    $scope.longitude = WeatherService.weatherLocation["attributes.coord_lon"];
    $scope.latitude = WeatherService.weatherLocation["attributes.coord_lat"];
    console.log(loc.attributes.forecast);
    //Get the forecast info
    $scope.forecastInfo = loc.attributes.forecast;
    $scope.retIconUrl = IconService.retIconUrl;
});
/**
 * Filter to round floats in a string format usable from HTML
 */
MAIN_MODULE.filter('toFixed', function () { //Turns string into float and removes decimals
    return function (string) {
        return parseFloat(string).toFixed();
    }
}).controller('eventCtrl', function($scope, $meteor, $reactive, $rootScope) {

    var popUpMulti = document.getElementById('pop-upMulti');

    $scope.events = [
        {
            coord: {
                lot: 5.487589,
                lat: 51.447835
            },
            street: "Woenselse Watermolen",
            description: {
                name: "Bomb Threat",
                sensor: "bomb detector",
                level: 9
            },
            time: 1530,
            date: 24052016,
            view: true,
            icon: "warningbombthreat"
        },
        {
            coord: {
                lot: 5.487589,
                lat: 51.447835
            },
            street: "Gildebuurt",
            description: {
                name: "Gas Leak",
                sensor: "gas detector",
                level: 10
            },
            time: 1630,
            date: 24052016,
            view: true,
            icon: "warninggasleak"
        },
        {
            coord: {
                lot: 5.487589,
                lat: 51.447835
            },
            street: "Witte Dame",
            description: {
                name: "Car Accident",
                sensor: "sound sensor",
                level: 7
            },
            time: 1730,
            date: 24052016,
            view: true,
            icon: "warninggeneral"
        }
    ]

    //fina the event with maximum level
    function getMaxLevel(events) {
        var maxLevel = 0;
        for (i = 0; i<events.length; i++) {
            if (events[i].description.level >= events[maxLevel].description.level) {
                maxLevel = i;
            }
        }
        return events[maxLevel];
    }

    //Set the default event as the one with the maximum
    if ($scope.events.length == 1) {
        $scope.selectedEvent = $scope.events[0];
    }
    else {
        $scope.selectedEvent = getMaxLevel($scope.events);
    }

    // When the event array is not empty, the warning window will pop up
    if ($scope.events.length != 0) {
        popUpMulti.style.display = "block";
    }

    //Close the pop-up windows when click on the x
    $scope.close = function(){
        popUpMulti.style.display = "none";
    }
});

