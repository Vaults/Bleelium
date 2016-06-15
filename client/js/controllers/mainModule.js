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
    MAIN_MODULE.factory('util',function(){
        return {
            map: {
                center: {
                    longitude: '5.48',
                    latitude: '51.44'
                },
                zoom: 11,
                events: {
                    click: (mapModel, eventName, originalEventArgs) => {
                    }
                },
                options: {
                    disableDefaultUI: true
                }

            },
            calculateMarkers : function(objs, markers, optFunc, click){
                var newMarkers = [];

                for (var i = 0; i < objs.length; i++) {
                    var options = {draggable: false};
                    if (objs[i].attributes) {
                        newMarkers.push({
                            options: optFunc(options, objs[i]),
                            events:{
                                click: click
                            },
                            location: {
                                longitude: (objs[i].attributes.coord_lon)?objs[i].attributes.coord_lon:objs[i].attributes.coord_lng,
                                latitude: objs[i].attributes.coord_lat,
                            }
                        });
                    }else {
                        markers[i].setMap(null);
                    }
                }
                return newMarkers;
            },
            initSetInfo: function(scope, func){
                var setInfo = function (event, arg) {
                    if (arg) {
                        func(arg);
                    }
                };
                scope.$on('setInfo', setInfo);
            }
        }
    })
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
            .state('parkingDetails', {
                url: '/parking/details',
                templateUrl: 'client/js/directives/infoParkingDetails.html',
                controller: 'parkingDetailsCtrl'
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
            {link: 'weather', text: 'WEATHER', color: '#47BB47'},
            {link: 'security', text: 'SECURITY', color: '#52acdb'},
            {link: 'energy', text: 'ENERGY', color: '#f3db36'},
        ];

        $scope.state = function() {
            var split = $location.path().split("/");
            console.log(split);
            return (split.length == 2)?split[1]:'';
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
    /**
     * @summary Keeps the parking spaces and area for the detailed view
     */
    MAIN_MODULE.factory('ParkingService', function() {
        var ParkingService = {};
        ParkingService.parkingSpaces = {};
        ParkingService.name = '';
        ParkingService.areaIndex = -1;
        ParkingService.color = {
            center : 'white',
            highlight: '#ea5959',
            remaining : 'lightGrey'
        };
        /**
         * @summary setter for fields
         * @param i lot to load
         * @param area ParkingArea object from DB
         */
        ParkingService.setInfo = function(i, area){
            this.parkingSpaces = area.lots[i].parkingSpaces;
            this.name = area.name;
            this.areaIndex = area.index;
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
        var wLoc = {
            'attributes.coord_lat': '5.48',
            'attributes.coord_lon': '51.44'
        };
        var ret = {
            setWeatherLocation : function(o){wLoc = o},
            getWeatherLocation : function(){return wLoc}
        };
        return ret;
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
            scope.capacity = result['spaces']; //get the amount of parking spaces for this parking area
            scope.occupied = result['occupied']; //get current occupancy number for this parking area
            scope.percent = (scope.occupied.total / scope.capacity.total) * 100; //update current occupancy percentage
            if(index) {
                scope.capacity = scope.capacity[index];
                scope.occupied = scope.occupied[index];
                scope.percent = (scope.occupied / scope.capacity) * 100; //update current occupancy percentage
            }
             //setTimeout(changeColor, 500);

        }
    }]);

    MAIN_MODULE.filter('convertHours', function () {
        /**
         * @summary convert integer amount of hours into a string with amount of days and hours
         * @return string hours/24+'d'+hours%24+'h'
         */
        return function (hours) {
            if (Math.floor(hours / 24) > 0) {
                return Math.floor(hours / 24) + 'd' + hours % 24 + 'h';
            }
            return hours % 24 + 'h';
        }
    });

}

export {MAIN_MODULE}
