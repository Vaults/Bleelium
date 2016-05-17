import {MAIN_MODULE} from  './mainModule.js';

MAIN_MODULE.directive('navBar', function () {
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
            {link: 'comfort', text: 'COMFORT', color: '#70cf7d'},
            {link: 'energy', text: 'ENERGY', color: '#f3db36'},
        ];
    }).directive('googleMap', function() {
    return {
        templateUrl: 'client/js/directives/google-map.html',
        scope: '='
    }
}).controller('googleMapCtrl', function($scope, $meteor, $reactive, $rootScope) {

    $meteor.subscribe('weatherPub');

    $scope.helpers({
        weatherStationDebug(){
            return WeatherStations.findOne({});
        },
        weatherStations(){
            return WeatherStations.find({});
        }
    });

    $scope.weatherStation = function(){
        var loc = $scope.getReactively('loc');
        var selector = {'attributes.coord_lat': String(lodash.round(loc.latitude,2)), 'attributes.coord_lon': String(lodash.round(loc.longitude,2))};
        console.log(selector);
        if(loc) {
            return WeatherStations.findOne(selector);
        }
        return {attributes: {coord_lon: 5.4, coord_lat: 51.4}};
    };

    $scope.findWheaterstationInfo = function (loc) {
        var selector = {'attributes.coord_lat': String(lodash.round(loc.latitude,2)), 'attributes.coord_lon': String(lodash.round(loc.longitude,2))};
        return WeatherStations.findOne(selector);
    }

    $scope.setName = function(name){
        $scope.test = name;
    }

    $scope

    $scope.$on('name', function(event, arg){
        $scope.loc = $scope.setLocation(arg.lat(), arg.lng());
        $scope.setName($scope.findWheaterstationInfo($scope.setLocation(arg.lat(), arg.lng())).attributes.name);
        $scope.latitude = arg.lat();
        $scope.longtitude = arg.lng();
        $scope.temperture = ($scope.findWheaterstationInfo($scope.setLocation(arg.lat(), arg.lng())).attributes.temp);
        $scope.$apply();

    })
    $scope.setLocation = function (latitude, longitude) {
        return {
            latitude,
            longitude
        }};
    var reload = function(){
        $reactive(this).attach($scope);
        var selStation = $scope.getReactively('weatherStationDebug');

        if(selStation) {
            if(!$scope.map) {

                $scope.map = {
                    center: {
                        longitude: selStation.attributes.coord_lon,
                        latitude: selStation.attributes.coord_lat,
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
            $scope.marker = {
                options: {
                    draggable: false
                },
                events: {
                    click: (marker, eventName, args) => {
                        console.log(marker.getPosition());
                        $rootScope.$broadcast('name', marker.getPosition());
                        $rootScope.$broadcast('place', 'GHELLO');
                        $rootScope.$broadcast('temp', 'GHELLO');
                        $rootScope.$broadcast('sunrise', 'GHELLO');
                        $rootScope.$broadcast('sunset', 'GHELLO');

                        $scope.$apply();
                    },
                    dragend: (marker, eventName, args) => {
                        this.setLocation(marker.getPosition().lat(), marker.getPosition().lng());
                        $scope.$apply();
                    }
                },
                location: {
                    longitude: selStation.attributes.coord_lon,
                    latitude: selStation.attributes.coord_lat,
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

