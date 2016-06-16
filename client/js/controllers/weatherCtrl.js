import {HTTP} from 'meteor/http';
import {MAIN_MODULE} from  './mainModule.js';

WeatherStations = new Mongo.Collection('weatherStations');

/**
 * @summary Controller for the weather tab. Controls the sidebar in the weather tab as well as the icons on the map
 * @param $scope Angular scope
 * @param $meteor Angular meteor handle
 * @param $reactive Angular reactive component
 * @param $rootScope Angular root scope
 * @param WeatherService stores the location of the currently selected weather station
 * @param IconService is used to set the marker icon
 */
MAIN_MODULE.controller('weatherCtrl', function ($scope, $meteor, $reactive, $rootScope, WeatherService, IconService, util) {
    $scope.map = util.map();

    $meteor.subscribe('weatherPub');
    $scope.markers = [];
    $scope.helpers({	//Scope helpers to get from Meteor collections
        weatherStations(){
            return WeatherStations.find({});
        }
    });

    /**
     * @summary Updates the scope information when a marker is clicked
     * @param arg WeatherStation information
     */
    util.initSetInfo($scope, function(arg){
            WeatherService.setWeatherLocationLat(arg.lat());
            WeatherService.setWeatherLocationLng(arg.lng());
            var loc = WeatherStations.findOne(WeatherService.findWeatherStationInfo(arg));
            $scope.loc = arg;;
            $scope.date = loc.attributes.date;
            $scope.name = loc.attributes.name;
            $scope.latitude = lodash.round(arg.lat(), 2);
            $scope.longtitude = lodash.round(arg.lng(), 2);
            $scope.temperature = lodash.round(loc.attributes.temp, 2);
            $scope.min = lodash.round(loc.attributes.temp_min, 2);
            $scope.max = lodash.round(loc.attributes.temp_max, 2);
            $scope.windDegrees = loc.attributes.wind_deg;
            $scope.Airpressure = lodash.round(loc.attributes.pressure);
            $scope.Humidity = lodash.round(loc.attributes.humidity);
            $scope.sunrise = loc.attributes.sunrise;
            $scope.sunset = loc.attributes.sunset;
            $scope.iconURL = IconService.retIconUrl(loc.attributes.weather_icon, 'weather');
    });

    /**
     * @summary Runs whenever weatherstation collection is updated. Pulls weatherstations and updates UI elements accordingly
     */
    var reload = function () {
        $reactive(this).attach($scope);
        var stations = $scope.getReactively('weatherStations');
        //Create map and center on Eindhoven
        var selStation = WeatherStations.findOne({"_id": "2756253"});
        if (selStation && !$scope.name) {
            $rootScope.$broadcast('setInfo',  WeatherService.getWeatherLocationSetInfo());
        }
        /**
         * @summary Create map markers for each of the weather stations
         * @param opts options to set in each marker
         * @param obj weatherstation object
         * @returns options to set in marker
         */
        var optFunc = function(opts, obj){
            opts['icon'] = IconService.createMarkerIcon(obj.attributes.weather_icon, 'weather')
            return opts;
        }
        /**
         * @summary Click event for marker
         * @param marker
         */
        var markerFunc = (marker)=>{
            $rootScope.$broadcast('setInfo', marker.getPosition());
        }
        $scope.markers = util.calculateMarkers(stations, $scope.markers, optFunc, markerFunc);

    }
    $scope.autorun(reload)

});
