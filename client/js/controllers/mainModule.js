import angular from 'angular';
import angularMeteor from 'angular-meteor';
import 'angular-simple-logger';
import 'angular-google-maps';
import 'angular-ui-bootstrap';
import 'angular-percent-circle-directive'

var MAIN_MODULE;
if (!MAIN_MODULE) {
    MAIN_MODULE = angular.module('dashboard', [
        angularMeteor,
        'nemLogging',
        'uiGmapgoogle-maps',
        'ui.bootstrap',
        'ui.router',
        'percentCircle-directive'
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
                url: '/weather/forecast',
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
                templateUrl: 'client/js/directives/infoSecurity.html'
            })
            .state('security.subemergency', {
                url: '/securityEmergencyEvent',
                templateUrl: 'client/js/directives/infoEmergencyEvent.html'
            })
            .state('security.subsound', {
                url: '/securitySoundEvent',
                templateUrl: 'client/js/directives/infoSoundEvent.html'
            });
    }).directive('criticalEvents', function () {
        return {
            templateUrl: 'client/js/directives/critical-event.html',
            scope: '=',
        };
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
    }).factory('IconService', function () {
        var IconService = {};
        /**
         * @summary Sanitize a string by removing '/' and '.' to prevent filepath exploits
         * @param {String} dirty An unsanitized string
         * @returns {String} not containing '/' and '.'
         */
        IconService.sanitizeStr = function (dirty) {
            var clean = lodash.replace(dirty, '/', '');
            var cleaner = lodash.replace(clean, '.', '');
            return cleaner;
        }
        /**
         * @summary
         * @param str
         * @returns {string}
         */
        IconService.retIconUrl = function (icon, folder) {
            return '/img/' + IconService.sanitizeStr(folder) + '/' + IconService.sanitizeStr(icon) + '.png';
        }

        /**
         * @summary Create the marker icon for google maps
         * @param icon string with icon name without extension
         * @param folder string of public image folder in which icon resides, for '/public/img/weather/01d.png' enter 'weather'
         * @returns {{url: '/public/img/' + folder + '/' + icon + '.png', anchor: {x: 24, y: 24}, scaledSize: {height: 48, width: 48}}}
         */
        IconService.createMarkerIcon = function (icon, folder) {
            return {
                url: IconService.retIconUrl(icon, folder),
                anchor: {
                    x: 24,
                    y: 24
                },
                scaledSize: {
                    height: 48,
                    width: 48
                }
            };
        }
        return IconService;
    }).factory('WeatherService', function () {
        return weatherLocation = {
            'attributes.coord_lat': '5.48',
            'attributes.coord_lon': '51.44'
        };
    });
    /**
     * Filter to round floats in a string format usable from HTML
     */
    MAIN_MODULE.filter('toFixed', function () { //Turns string into float and removes decimals
        return function (string) {
            return parseFloat(string).toFixed();
        }
    });
}

export {MAIN_MODULE}