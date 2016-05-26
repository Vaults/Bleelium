import {HTTP} from 'meteor/http';
import {MAIN_MODULE} from  './mainModule.js';

WeatherStations = new Mongo.Collection('weatherStations');

MAIN_MODULE.controller('weatherCtrl', function ($scope, $meteor, $reactive, $rootScope, WeatherService, IconService) {

    $meteor.subscribe('weatherPub');
    $scope.markers = [];
    $scope.helpers({	//Scope helpers to get from Meteor collections
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
        console.log(loc.lat());
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
        console.log(arg);
        if (arg) {
            var loc = $scope.findWeatherStationInfo(arg);
            console.log(loc);
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
            //$scope.windDirection = getWindDir(loc.attributes.wind_deg);
            $scope.Airpressure = lodash.round(loc.attributes.pressure);
            $scope.Humidity = lodash.round(loc.attributes.humidity);
            $scope.sunrise = loc.attributes.sunrise;
            $scope.sunset = loc.attributes.sunset;
            $scope.iconURL = IconService.retIconUrl(loc.attributes.weather_icon, 'weather');
            //$scope.$apply();
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
        var stations = $scope.getReactively('weatherStations');
        //Create map and center on Eindhoven
        var selStation = WeatherStations.findOne({"_id": "2756253"});
        if (selStation) {
            if (!$scope.map) {
                var temp = {
                    lat: function(){
                        return '51.44';

                    },
                    lng: function(){
                        return '5.48';
                    }
                };
                setInfo(null, temp);

                $scope.map = {
                    center: {
                        longitude: selStation.attributes.coord_lon,
                        latitude: selStation.attributes.coord_lat,
                    },
                    zoom: 11,
                    events: {
                        click: (mapModel, eventName, originalEventArgs) => {
                            //$scope.$apply();
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