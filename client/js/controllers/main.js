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
            {link: "parking", text: 'PARKING', color: '#ea5959'},
            {link: 'weather', text: 'WEATHER', color: '#eb9860'},
            {link: 'security', text: 'SECURITY', color: '#52acdb'},
            {link: 'energy', text: 'ENERGY', color: '#f3db36'},
        ];
    }).directive('googleMap', function() {
    return {
        templateUrl: 'client/js/directives/google-map.html',
        scope: '='
    }
}).controller('weatherCtrl', function($scope, $meteor, $reactive, $rootScope) {
	
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

    $scope.findWeatherStationInfo = function (loc) {
        var selector = {'attributes.coord_lat': String(lodash.round(loc.lat(),2)), 'attributes.coord_lon': String(lodash.round(loc.lng(),2))};
        return WeatherStations.findOne(selector);
    }
	var sanitizeStr = function(dirty){
		var clean = lodash.replace(str, '/', '');
		var cleaner = lodash.replace(str, '.', '');
		return cleaner;
	}
     var setInfo = function(event, arg){
         if(arg){
             var loc = $scope.findWeatherStationInfo(arg);
             $scope.loc = arg;
             $scope.name = loc.attributes.name;
             $scope.latitude = lodash.round(arg.lat(),2);
             $scope.longtitude = lodash.round(arg.lng(),2);
             $scope.temperature = loc.attributes.temp;
             $scope.sunrise = loc.attributes.sunrise;
             $scope.sunset = loc.attributes.sunset;
			 $scope.iconURL = '/img/weather/' + sanitizeStr(loc.attributes.weather_icon) + '.png';
             $scope.$apply();
         }
     };

    $scope.$on('setInfo', setInfo);
    $scope.setLocation = function (latitude, longitude) {
        return {
            latitude,
            longitude
        }};
    var reload = function(){
        $reactive(this).attach($scope);
        var selStation = $scope.getReactively('weatherStationDebug');
        setInfo(null, $scope.loc);
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
                    draggable: false,
                    icon: {
                        url: $scope.iconURL,
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
                        $rootScope.$broadcast('setInfo', marker.getPosition());
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


}).controller('parkingCtrl', function($scope, $meteor, $reactive) {

					$scope.map = {
                    center: {
                        longitude: 5.4500238,
                        latitude: 51.4523127,
                    },
                    zoom: 15,
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
   

});

// .config(['uiGmapGoogleMapApiProvider', function (GoogleMapApi) {
//     GoogleMapApi.configure({
//         client : 'Smart-S GMaps Key',
//         v: '3.17',
//         libraries: 'weather,geometry,visualization',
//         key: 'AIzaSyDrDOuv952_6s8fSldXtgoJsCMyEo6LXEE'
//     });
// }]);

