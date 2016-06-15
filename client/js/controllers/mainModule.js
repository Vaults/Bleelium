import angular from 'angular';
import angularMeteor from 'angular-meteor';
import 'angular-simple-logger';
import 'angular-google-maps';
import 'angular-ui-bootstrap';
import 'angular-percent-circle-directive'


/**
 * The main Angular module which stores the state of the application, as well as containing all controllers
 * These controllers are defined in their own files
 * @var {angular.module} MAIN_MODULE
 */
var MAIN_MODULE;
if (!MAIN_MODULE) {
    MAIN_MODULE = angular.module('dashboard', [
        angularMeteor,
        'nemLogging',
        'uiGmapgoogle-maps',
        'ui.bootstrap',
        'ui.router',
        'percentCircle-directive'
    ]);    
    /**
     * @summary Specifies which urls route to which files and controllers
     */
    MAIN_MODULE.config(function ($stateProvider, $urlRouterProvider) {
        document.title = 'Smart-S';
        $urlRouterProvider.otherwise('/');

        $stateProvider.state('weather', {
            templateUrl: 'client/ui-view.html',
            controller: 'weatherCtrl'
        })
            .state('index', {
                url: '/',
                templateUrl: 'client/js/directives/index.html'
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
            .state('details', {
                url: '/parking/details',
                templateUrl: 'client/js/directives/infoDetails.html',
                controller: 'detailsCtrl'
            })
            .state('security', {
                templateUrl: 'client/ui-view.html',
                controller: 'securityCtrl',
            })
            .state('security.sub', {
                url: '/security',
                templateUrl: 'client/js/directives/infoSecurity.html',
            })
            .state('security.subemergency', {
                url: '/securityEmergencyEvent',
                templateUrl: 'client/js/directives/infoEmergencyEvent.html'
            })
            .state('security.subsound', {
                url: '/securitySoundEvent',
                templateUrl: 'client/js/directives/infoSoundEvent.html'
            })
            .state('energy', {
                templateUrl: 'client/ui-view.html',
                controller: 'energyCtrl'
            })
            .state('energy.sub', {
                url: '/energy',
                //templateUrl: 'client/js/directives/infoWeather.html'
            });
    });
    /**
     * @summary Binds the critical event HTML to the name criticalEvents
     */
    MAIN_MODULE.directive('criticalEvents', function () {
    return {
        templateUrl: 'client/js/directives/critical-event.html',
        scope: '=',
    };
    });
    /**
     * @summary Binds the navigation bar HTML to the name navBar
     */
    MAIN_MODULE.directive('navBar', function () {
        return {
            templateUrl: 'client/js/directives/nav-bar.html',
            scope: '=',
        };
    });
    /**
     * @summary Controller for the navigation bar, keeps categories and highlights current category
     */
    MAIN_MODULE.controller('navBarCtrl', function ($scope, $location) {
        /**
         * @summary Determine which tab is currently selected
         * @param {String} path to test current webpage path to
         * @returns {string} active when path === current page, '' otherwise
         */
        $scope.navClass = function (path) {
            return (($location.path().substr(1, path.length)) === path) ? 'active' : '';
        };
        //Categories to display in the top bar.
        $scope.categories = [
            {link: 'parking', text: 'PARKING', color: '#ea5959'},
            {link: 'weather', text: 'WEATHER', color: '#eb9860'},
            {link: 'security', text: 'SECURITY', color: '#52acdb'},
            {link: 'energy', text: 'ENERGY', color: '#f3db36'},
        ];

        $scope.state = function() {
            return $location.path().replace(/\//g, '');
        }
    });
    /**
     * @summary Creates HTML tag for adding a google map
     */
    MAIN_MODULE.directive('googleMap', function () {
        return {
            templateUrl: 'client/js/directives/google-map.html',
            scope: '='
        }
    });
    MAIN_MODULE.factory('ParkingService', function() {
        var ParkingService = {};
        ParkingService.parkingSpaces = {};
        ParkingService.setParkingImage = function() {
            var parkingSpaces = ParkingService.parkingSpaces;
            //For each full parking space, set the svg's color to red, otherwise green
            for (var i = 0; i < parkingSpaces.length; i++){
                var selector = "#ParkingSpace-"+(i+1);
                var thisSpace = document.querySelector(selector);
                if(!thisSpace){
                    continue;
                }
                if(parkingSpaces[i].attributes.occupied === "true"){
                    thisSpace.style.fill = "#ea5959";
                }
                else {
                    thisSpace.style.fill = "#53dc4e";
                }
            }
        };
        ParkingService.parkingLocation = {
            'attributes.coord_lat': '51.448527',
            'attributes.coord_lon': '5.452773'
        };
        return ParkingService;
    });
    /**
     * @summary Provides functionality for displaying icons in UI and on markers
     */
    MAIN_MODULE.factory('IconService', function () {
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
    });
    /**
     * @summary keeps the currently selected weatherstation's location
     */
    MAIN_MODULE.factory('WeatherService', function () {
        return weatherLocation = {
            'attributes.coord_lat': '5.48',
            'attributes.coord_lon': '51.44'
        };
    });
    /**
     * @summary Filter to round floats in a string format usable from HTML
     */
    MAIN_MODULE.filter('toFixed', function () { //Turns string into float and removes decimals
        return function (string) {
            return parseFloat(string).toFixed();
        }
    });
    /**
     * @summary caches data, and queues calls of aggregateparking
     */
    MAIN_MODULE.factory('aggregateParking', function(){
        var data = { spaces: { '1': 240, '2': 120, '3': 498, total: 858 },occupied: { '1': 120, '2': 61, '3': 243, total: 424 } };
        var flag = false;
        return function() {
            if(!flag){
                flag = true;
                Meteor.call('aggregateParking', function(e, r){
                    data = r;
                    flag = false;
                })
            }
            return data;
        }
    });

    /**
     * @summary caches data, and queues calls of aggregateSecurity;
     */
    MAIN_MODULE.factory('aggregateSecurity', function(){
        var data = {counts:{}};
        var flag = false;
        return function() {
            if(!flag){
                flag = true;
                Meteor.call('aggregateSecurity', function(e, r){
                    data = r;
                    flag = false;
                })
            }
            return data;
        }
    });
    
    MAIN_MODULE.factory('circleHandler', ['aggregateParking', function(aggregateParking){
        return function(scope, index) {
            var setFreeColor = function (c) {
                scope.color = {
                    center: 'white',
                    highlight: c,
                    remaining: 'lightGrey'
                }
            }
            var changeColor = function () {
                if (scope.percent <= 100) {
                    if (scope.percent <= 50) {
                        setFreeColor('green');
                    }
                    else if (scope.percent > 50 && scope.percent < 95) {
                        setFreeColor('orange');
                    }
                    else {
                        setFreeColor('red');
                    }
                }
            }

            var result = aggregateParking();
            console.log(result);
            scope.capacity = result['spaces']; //get the amount of parking spaces for this parking area
            scope.occupied = result['occupied']; //get current occupancy number for this parking area
            scope.percent = (scope.occupied.total / scope.capacity.total) * 100; //update current occupancy percentage
            if(index) {
                scope.capacity = scope.capacity[index];
                scope.occupied = scope.occupied[index];
                scope.percent = (scope.occupied / scope.capacity) * 100; //update current occupancy percentage
            }

            changeColor();
        }
    }]);
}

export {MAIN_MODULE}
