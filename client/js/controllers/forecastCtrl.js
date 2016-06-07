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
    //If no weatherstation selected, use Eindhoven
    if (WeatherService.weatherLocation == null) {
        WeatherService.weatherLocation = {'attributes.coord_lat': '51.44', 'attributes.coord_lon': '5.48'};
    }

    //Load the name and coordinates for this location
    var loc = WeatherStations.findOne(WeatherService.weatherLocation);

    //Set scope to selected weatherstation
    $scope.name = loc.attributes.name;
    $scope.longitude = WeatherService.weatherLocation["attributes.coord_lon"];
    $scope.latitude = WeatherService.weatherLocation["attributes.coord_lat"];
    console.log(loc.attributes.forecast);
    //Get the forecast info
    $scope.forecastInfo = loc.attributes.forecast;
    $scope.retIconUrl = IconService.retIconUrl;
});