import {HTTP} from 'meteor/http';
import {MAIN_MODULE} from  './mainModule.js';


MAIN_MODULE.controller('indexCtrl', function ($scope, $meteor, $reactive, $rootScope, WeatherService, IconService, aggregateSecurity, aggregateParking, circleHandler, ParkingService, util) {
    $meteor.subscribe('weatherPub');
    $meteor.subscribe('P2000Pub');
    $meteor.subscribe('soundSensorPub');
    $meteor.subscribe('criticalEventsPub');
    $meteor.subscribe('parkingAreaPub');
    $scope.color = ParkingService.color;
    $scope.helpers({	//Scope helpers to get from Meteor collections
        weatherStations(){
            return WeatherStations.find({});
        },
        parkingArea(){
            return ParkingArea.find({});
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
    util.initSetInfo($scope, function(arg){
            var loc = $scope.findWeatherStationInfo(arg);
            $scope.weather_loc = arg;
            WeatherService.weatherLocation = { //Set a global variable with current location
                'attributes.coord_lat': '' + lodash.round(arg.lat(), 2),
                'attributes.coord_lon': '' + lodash.round(arg.lng(), 2)
            };
            $scope.weather_date = loc.attributes.date;
            $scope.weather_name = loc.attributes.name;
            $scope.weather_latitude = lodash.round(arg.lat(), 2);
            $scope.weather_longtitude = lodash.round(arg.lng(), 2);
            $scope.weather_temperature = lodash.round(loc.attributes.temp, 2);
            $scope.weather_min = lodash.round(loc.attributes.temp_min, 2);
            $scope.weather_max = lodash.round(loc.attributes.temp_max, 2);
            $scope.weather_windDegrees = loc.attributes.wind_deg;
            //$scope.windDirection = getWindDir(loc.attributes.wind_deg);
            $scope.weather_Airpressure = lodash.round(loc.attributes.pressure);
            $scope.weather_Humidity = lodash.round(loc.attributes.humidity);
            $scope.weather_sunrise = loc.attributes.sunrise;
            $scope.weather_sunset = loc.attributes.sunset;
            $scope.weather_iconURL = IconService.retIconUrl(loc.attributes.weather_icon, 'weather');
            //$scope.$apply();
    });





    /**
     * @summary Runs whenever weatherstation collection is updated. Pulls weatherstations and updates UI elements accordingly
     */
    var reload = function () {
        console.log($scope.getReactively('parkingArea'));
        var selStation = WeatherStations.findOne({"_id": "2756253"});
        if (selStation && !$scope.name) {
            $rootScope.$broadcast('setInfo', {
                lat: function(){
                    return '51.44';

                },
                lng: function(){
                    return '5.48';
                }
            });
        }

        circleHandler($scope);
        var security = aggregateSecurity().counts;
        $scope.eventTypes = util.eventTypes;
        for(key in $scope.eventTypes){
            $scope.eventTypes[key].count = security[$scope.eventTypes[key].name];
        }
    }
    $scope.autorun(reload)


});
