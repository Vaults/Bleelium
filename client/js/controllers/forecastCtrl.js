import {MAIN_MODULE} from  './mainModule.js';

/**
 * @summary Controller for the forecast tab. Loads the current weatherstation and sets scope variables accordingly
 * @param $scope Angular scope
 * @param $meteor Angular meteor handle
 * @param $reactive Angular reactive component
 * @param $rootScope Angular root scope
 * @param WeatherService stores the location of the currently selected weather station
 * @param IconService is used to set the marker icon
 */
MAIN_MODULE.controller('forecastCtrl', function ($scope, $meteor, WeatherService, IconService) {

    $meteor.subscribe('weatherPub');

    //Load the name and coordinates for this location
    var loc = WeatherStations.findOne(WeatherService.findWeatherStationInfo(WeatherService.getWeatherLocationSetInfo()));

    //Set scope to selected weatherstation
    $scope.name = loc.attributes.name;
    $scope.longitude = loc.attributes.coord_lon;
    $scope.latitude = loc.attributes.coord_lat;
    $scope.forecastInfo = loc.attributes.forecast;
    $scope.retIconUrl = IconService.retIconUrl;
});