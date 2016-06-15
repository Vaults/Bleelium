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
     * @summary Collection of miscellaneous functions for use in multiple controllers
     */
    MAIN_MODULE.factory('util', function () {
        return {
            /**
             * @summary global variable to keep state of map
             */
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
            /**
             * @summary Creates all markers for the map and adds correct parameters using helper functions
             * @param objs Objects to represent on map
             * @param markers Current set of markers on map
             * @param optFunc Sets new marker parameters
             * @param click Specifies click event
             * @returns {Array} new markers
             */
            calculateMarkers: function (objs, markers, optFunc, click) {
                var newMarkers = [];

                for (var i = 0; i < objs.length; i++) {
                    var options = {draggable: false};
                    if (objs[i].attributes) {
                        newMarkers.push({
                            options: optFunc(options, objs[i]),
                            events: {
                                click: click
                            },
                            location: {
                                longitude: (objs[i].attributes.coord_lon) ? objs[i].attributes.coord_lon : objs[i].attributes.coord_lng,
                                latitude: objs[i].attributes.coord_lat,
                            }
                        });
                    } else {
                        markers[i].setMap(null);
                    }
                }
                return newMarkers;
            },
            /**
             * @summary Abstract function. Calls func() when setInfo is broadcasted and arg is set
             * @param func function to call
             */
            initSetInfo: function (scope, func) {
                var setInfo = function (event, arg) {
                    if (arg) {
                        func(arg);
                    }
                };
                scope.$on('setInfo', setInfo);
            },
            /**
             * @summary Global variable specifying all event types
             */
            eventTypes: {
                'policedept': {
                    icon: 'img/security/Politie.png',
                    text: 'Police Department',
                    name: 'Politie',
                    checked: true
                },
                'firedept': {
                    icon: 'img/security/brandweer.png',
                    text: 'Fire Department',
                    name: 'brandweer',
                    checked: true
                },
                'paramedics': {
                    icon: 'img/security/Ambulance.png',
                    text: 'Paramedics',
                    name: 'Ambulance',
                    checked: false,
                    style: 'margin-bottom: 20px'
                },
                'gunshot': {icon: 'img/security/gunshot.png', text: 'Gunshot', name: 'gunshot', checked: true},
                'stressedvoice': {
                    icon: 'img/security/stressedvoice.png',
                    text: 'Stressed Voice',
                    name: 'stressedvoice',
                    checked: false
                },
                'caralarm': {icon: 'img/security/caralarm.png', text: 'Car Alarm', name: 'caralarm', checked: false},
                'brokenglass': {
                    icon: 'img/security/brokenglass.png',
                    text: 'Broken Glass',
                    name: 'brokenglass',
                    checked: true
                },
                'caraccident': {
                    icon: 'img/security/caraccident.png',
                    text: 'Car accident',
                    checked: true,
                    name: 'caraccident',
                    style: 'margin-bottom: 20px'
                },
                'warninggeneral': {icon: 'img/security/warninggeneral.png', text: 'Critical Event', checked: true},
                'warningevacuation': {icon: 'img/security/warningfire2.png', text: 'Evacuation Notice', checked: false},
                'warningfire': {icon: 'img/security/warningfire.png', text: 'Fire Alarm', checked: false},
                'warningbombthreat': {icon: 'img/security/warningbombthreat.png', text: 'Bomb Threat', checked: false},
                'warninggasleak': {icon: 'img/security/Gas.png', text: 'Gas Leak', name: 'Gas', checked: true},
                'warningsmoke': {icon: 'img/security/Smoke.png', text: 'Smoke', name: 'Smoke', checked: true}
            },
        };
    });
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
            })
            .state('energy', {
                templateUrl: 'client/ui-view.html',
                controller: 'energyCtrl'
            })
            .state('energy.sub', {
                url: '/energy'
            });
    });
    /**
     * @summary Binds the critical event HTML to the name criticalEvents
     */
    MAIN_MODULE.directive('criticalEvents', function () {
        return {
            templateUrl: 'client/js/directives/critical-event.html',
            scope: '='
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
        /**
         * @summary Categories to display in the top bar.
         */
        $scope.categories = [
            {link: 'parking', text: 'PARKING', color: '#ea5959'},
            {link: 'weather', text: 'WEATHER', color: '#47BB47'},
            {link: 'security', text: 'SECURITY', color: '#52acdb'},
            {link: 'energy', text: 'ENERGY', color: '#f3db36'},
        ];
        /**
         * @summary Obtains state to be able to display correct navigation bar colors
         * @returns {string} state
         */
        $scope.state = function () {
            var split = $location.path().split("/");
            return (split.length == 2) ? split[1] : '';
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
    MAIN_MODULE.factory('ParkingService', function () {
        var ParkingService = {};
        ParkingService.parkingSpaces = {};
        ParkingService.name = '';
        ParkingService.areaIndex = -1;
        ParkingService.color = {
            center: 'white',
            highlight: '#ea5959',
            remaining: 'lightGrey'
        };
        /**
         * @summary setter for fields
         * @param i lot to load
         * @param area ParkingArea object from DB
         */
        ParkingService.setInfo = function (i, area) {
            this.parkingSpaces = area.lots[i].parkingSpaces;
            this.name = area.name;
            this.areaIndex = area.index;
        };
        /**
         * @summary Keeps currently selected parking area
         */
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
     * @summary keeps the currently selected weatherstation
     */
    MAIN_MODULE.factory('WeatherService', function () {
        var wLoc = {
                latitude: '51.44',
                longitude: '5.48',
                lat: function () {
                    return this.latitude;
                },
                lng: function () {
                    return this.longitude;
                }
            };
        var ret = {
            setWeatherLocationLat: function (lat) {
                wLoc.latitude = '' + lodash.round(lat, 2)
            },
            setWeatherLocationLng: function (lng) {
                wLoc.longitude = '' + lodash.round(lng, 2)
            },
            getWeatherLocationSetInfo: function () {
                return wLoc;
            },
            /**
             * @summary Find a weatherstation based on geolocation
             * @param loc object with attributes 'attributes.coord_lat' and 'attributes.coord_lon'
             * @returns selector
             */
            findWeatherStationInfo : function (loc) { //Finds a weather station from coordinates
                return {
                    'attributes.coord_lat': String(lodash.round(loc.lat(), 2)),
                    'attributes.coord_lon': String(lodash.round(loc.lng(), 2))
                };
            }
        };
        return ret;
    });
    /**
     * @summary Filter to round floats and turn into a string format usable from HTML
     */
    MAIN_MODULE.filter('toFixed', function () {
        return function (string) {
            return parseFloat(string).toFixed();
        }
    });



    /**
     * @summary caches data, and queues calls of aggregateparking
     */
    MAIN_MODULE.factory('aggregateParking', function () {
        var data = {
            spaces: {'1': 240, '2': 120, '3': 498, total: 858},
            occupied: {'1': 120, '2': 61, '3': 243, total: 424}
        };
        var flag = false;
        return function () {
            if (!flag) {
                flag = true;
                Meteor.call('aggregateParking', function (e, r) {
                    data = r;
                    flag = false;
                })
            }
            return data;
        }
    });

    /**
     * @summary caches data, and queues calls of aggregateSecurity
     * Although aggregateSecurity and aggregateParking have similar structure, this is non-trivial
     * to delegate to a helper function. Unfortunately if done, the variables within the factories
     * cannot be mutated.
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

    /**
     * @summary Sets scope for percentage circle visualizations
     */
    MAIN_MODULE.factory('circleHandler', ['aggregateParking', function (aggregateParking) {
        return function (scope, index) {
            /*var setFreeColor = function (c) {
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
            }*/
            var result = aggregateParking();
            scope.capacity = result['spaces']; //get the amount of parking spaces for this parking area
            scope.occupied = result['occupied']; //get current occupancy number for this parking area
            scope.percent = (scope.occupied.total / scope.capacity.total) * 100; //update current occupancy percentage
            if (index) {
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
