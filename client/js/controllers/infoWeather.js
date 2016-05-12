import { MAIN_MODULE } from './mainModule.js';
import { HTTP } from 'meteor/http';

WeatherStations = new Mongo.Collection('weatherStations');


MAIN_MODULE.directive('infoWeather', function () {
    return {
        templateUrl: 'client/js/directives/infoWeather.html',
        scope: '=',
    };
}).controller('infoCtrl', function ($scope, $meteor) {
    $meteor.subscribe('weatherPub');
    $scope.location = "location data"  //TODO grab from server.
    $scope.coordinates = "coordinate data"  //TODO grab from server.
    $scope.currentTemp = 22
    $scope.predictTemp = "predictTemp"
    $scope.minTemp = "22"
    $scope.maxTemp = "27"
    $scope.rainChance = "rainChance"
    $scope.windSpeed = "windSpeed"
    $scope.sunrise = 8
    $scope.sunset = 22

    $scope.helpers({
      weatherStation() {
        return WeatherStations.findOne({});
      }
    });
});
