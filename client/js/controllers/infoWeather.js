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

    $scope.helpers({
      weatherStation() {
        return WeatherStations.findOne({});
      }
    });
});
