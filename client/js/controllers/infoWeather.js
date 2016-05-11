import { MAIN_MODULE } from './mainModule.js';

MAIN_MODULE.directive('infoWeather', function () {
    return {
        templateUrl: 'client/js/directives/infoWeather.html',
        scope: '=',
    };
}).controller('infoCtrl', function ($scope) {

});