import { MAIN_MODULE } from './mainModule.js';
import { HTTP } from 'meteor/http';

MAIN_MODULE.directive('infoWeather', function () {
    return {
        templateUrl: 'client/js/directives/infoWeather.html',
        scope: '=',
    };
}).controller('infoCtrl', function ($scope) {
    $scope.location = "location data"  //TODO grab from server.
    $scope.coordinates = "coordinate data"  //TODO grab from server.
    $scope.currentTemp = 22
    $scope.predictTemp = "predictTemp"
    $scope.minTemp = "12"
    $scope.maxTemp = "27"
    $scope.rainChance = "rainChance"
    $scope.windSpeed = "windSpeed"
    $scope.sunrise = 8
    $scope.sunset = 22

});
