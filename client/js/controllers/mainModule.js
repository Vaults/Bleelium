import angular from 'angular';
import angularMeteor from 'angular-meteor';
import 'angular-simple-logger';
import 'angular-google-maps';
import 'angular-ui-bootstrap';

var MAIN_MODULE;
if (!MAIN_MODULE) {
    MAIN_MODULE = angular.module('dashboard', [
        angularMeteor,
        'nemLogging',
        'uiGmapgoogle-maps',
        'ui.bootstrap',
        'ui.router'
    ]).config(function ($stateProvider, $urlRouterProvider) {
        document.title = 'Smart-S';
        $urlRouterProvider.otherwise('/weather');

        $stateProvider.state('weather', {
                templateUrl: 'client/ui-view.html',
                controller: 'weatherCtrl'
            })
            .state('weather.sub', {
                url: '/weather',
                templateUrl: 'client/js/directives/infoWeather.html'
            })
            .state('forecast', {
                url: '/forecast',
                templateUrl: 'client/js/directives/infoForecast.html',
                controller: 'forecastCtrl'
            })
            .state('parking', {
                templateUrl: 'client/ui-view.html',
                controller: 'parkingCtrl'
            })
            .state('parking.sub', {
                url: '/parking',
                templateUrl: 'client/js/directives/infoParking.html'
            })
            .state('security', {
                templateUrl: 'client/ui-view.html',
                controller: 'securityCtrl'
            })
            .state('security.sub', {
                url: '/security',
                templateUrl: 'client/js/directives/infoSoundEvent.html'
            });
    }).directive('navBar', function () {
        return {
            templateUrl: 'client/js/directives/nav-bar.html',
            scope: '=',
        };
    }).controller('navBarCtrl', function ($scope, $location) {
        $scope.navClass = function (path) {
            return (($location.path().substr(1, path.length) === path) ? 'active' : '');
        };
        $scope.categories = [
            {link: 'parking', text: 'PARKING', color: '#ea5959'},
            {link: 'weather', text: 'WEATHER', color: '#eb9860'},
            {link: 'security', text: 'SECURITY', color: '#52acdb'},
            {link: 'energy', text: 'ENERGY', color: '#f3db36'},
        ];
    }).directive('googleMap', function () {
        return {
            templateUrl: 'client/js/directives/google-map.html',
            scope: '='
        }
		}).factory('IconService', function(){
        var IconService = {};
        IconService.sanitizeStr = function(dirty) { //Cleans a string to prevent filepath exploits
            var clean = lodash.replace(dirty, '/', '');
            var cleaner = lodash.replace(clean, '.', '');
            return cleaner;
        }
        IconService.retIconUrl = function(str) {
            return '/img/weather/' + IconService.sanitizeStr(str) + '.png';
        }
        return IconService;
    })
        .factory('WeatherService', function(){
			return weatherLocation = {
				'attributes.coord_lat': '5.48',
				'attributes.coord_lon': '51.44'
			};


    });
}

export {MAIN_MODULE}