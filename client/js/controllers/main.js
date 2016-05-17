import {MAIN_MODULE} from  './mainModule.js';

MAIN_MODULE.directive('navBar', function () {
    document.title = 'Smart-S';
        return {
            templateUrl: 'client/js/directives/nav-bar.html',
            scope: '=',
        };
    }).controller('navBarCtrl', function ($scope, $location) {
        $scope.navClass = function (path) {
            return (($location.path().substr(1, path.length) === path) ? 'active' : '');
        };
        $scope.categories = [
            {link: "mobility", text: 'MOBILITY', color: '#ea5959'},
            {link: 'weather', text: 'WEATHER', color: '#eb9860'},
            {link: 'security', text: 'SECURITY', color: '#52acdb'},
            {link: 'energy', text: 'ENERGY', color: '#f3db36'},
        ];
    }).directive('googleMap', function() {
    return {
        templateUrl: 'client/js/directives/google-map.html',
        scope: '='
    }
}).controller('googleMapCtrl', function($scope, $meteor, $reactive) {
    $meteor.subscribe('weatherPub');

    $scope.helpers({
        weatherStation() {
            return WeatherStations.findOne({});
        }
    });

    var reload = function(){
        $reactive(this).attach($scope);
        var weatherStation = this.getReactively('weatherStation');
        if(weatherStation) {
            if(!$scope.map) {

                $scope.map = {
                    center: {
                        longitude: weatherStation.attributes.coord_lon,
                        latitude: weatherStation.attributes.coord_lat,
                    },
                    zoom: 11,
                    events: {
                        click: (mapModel, eventName, originalEventArgs) => {
                            this.setLocation(originalEventArgs[0].latLng.lat(), originalEventArgs[0].latLng.lng());
                            $scope.$apply();
                        }
                    },
                    options: {
                        disableDefaultUI: true
                    }

                };
            }

            $scope.setLocation = function (latitude, longitude) {
                return {
                    latitude,
                    longitude
                }};

            $scope.marker = {
                options: {
                    draggable: false,
                    icon: {
                        url: '/img/weather/' + weatherStation.attributes.weather_icon + '.png',
                        size: {
                            height: 200,
                            width: 200
                        },
                        anchor: {
                            x: 24,
                            y: 24
                        },
                        scaledSize: {
                            height: 48,
                            width: 48
                        }
                    },
                },
                events: {
                    click: (marker, eventName, args) => {
                        this.setLocation(marker.getPosition().lat(), marker.getPosition().lng());
                        $scope.$apply();
                    },
                    dragend: (marker, eventName, args) => {
                        this.setLocation(marker.getPosition().lat(), marker.getPosition().lng());
                        $scope.$apply();
                    }
                },
                location: {
                    longitude: weatherStation.attributes.coord_lon,
                    latitude: weatherStation.attributes.coord_lat,
                },
            };
        }

    }
    $scope.autorun(reload)


});

// .config(['uiGmapGoogleMapApiProvider', function (GoogleMapApi) {
//     GoogleMapApi.configure({
//         client : 'Smart-S GMaps Key',
//         v: '3.17',
//         libraries: 'weather,geometry,visualization',
//         key: 'AIzaSyDrDOuv952_6s8fSldXtgoJsCMyEo6LXEE'
//     });
// }]);

