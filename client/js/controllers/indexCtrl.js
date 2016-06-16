import {HTTP} from 'meteor/http';
import {MAIN_MODULE} from  './mainModule.js';

/**
 * @summary controller for the homepage. Displays common information for each visualization category
 * @param $scope Angular scope
 * @param $meteor Angular meteor handle
 * @param $reactive Angular reactive component
 * @param $rootScope Angular root scope
 * @param WeatherService stores the location of the currently selected weather station
 * @param IconService is used to set the marker icon
 * @param aggregateSecurity is used for the P2000 to get each event's counts
 * @param aggregateParking is used for the parking space aggregation to get the occupancy values
 * @param circleHandler is used to give correct scope values to the percentage circle
 * @param ParkingService is used to keep parking state
 * @param util is used for miscellaneous functions
 */
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
     * @summary Updates the scope information for the weather station
     * @param arg WeatherStation information
     */
    util.initSetInfo($scope, function(arg){
            var loc = WeatherStations.findOne(WeatherService.findWeatherStationInfo(arg));
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
            $scope.weather_Airpressure = lodash.round(loc.attributes.pressure);
            $scope.weather_Humidity = lodash.round(loc.attributes.humidity);
            $scope.weather_sunrise = loc.attributes.sunrise;
            $scope.weather_sunset = loc.attributes.sunset;
            $scope.weather_iconURL = IconService.retIconUrl(loc.attributes.weather_icon, 'weather');
    });





    /**
     * @summary Runs whenever weatherstation collection is updated. Pulls weatherstations and updates UI elements accordingly
     */
    var reload = function () {  
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
