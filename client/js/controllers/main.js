import {MAIN_MODULE} from  './mainModule.js';

MAIN_MODULE.controller('weatherCtrl', function($scope, $meteor, $reactive, $rootScope) {
	
    $meteor.subscribe('weatherPub');
	$scope.markers = [];
    $scope.helpers({
        weatherStationDebug(){
            return WeatherStations.findOne({"attributes.name":"Eindhoven"});
        },
        weatherStations(){
            return WeatherStations.find({});
        }
    });


    $scope.findWeatherStationInfo = function (loc) {
        var selector = {'attributes.coord_lat': String(lodash.round(loc.lat(),2)), 'attributes.coord_lon': String(lodash.round(loc.lng(),2))};
        return WeatherStations.findOne(selector);
    }
	var sanitizeStr = function(dirty){
		var clean = lodash.replace(dirty, '/', '');
		var cleaner = lodash.replace(clean, '.', '');
		return cleaner;
	}
	var retIconURL = function(str){
		return '/img/weather/' + sanitizeStr(str) + '.png';
	}
	var setInfo = function(event, arg){
         if(arg){
             var loc = $scope.findWeatherStationInfo(arg);
			 console.log(loc);
             $scope.loc = arg;
             $scope.name = loc.attributes.name;
             $scope.latitude = lodash.round(arg.lat(),2);
             $scope.longtitude = lodash.round(arg.lng(),2);
             $scope.temperature = loc.attributes.temp;
             $scope.sunrise = loc.attributes.sunrise;
             $scope.sunset = loc.attributes.sunset;
			 $scope.iconURL = retIconURL(loc.attributes.weather_icon);
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
		var stations = $scope.getReactively('weatherStations');
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
        }
		$scope.markers = [];
		for(var i = 0; i < stations.length; i++){
			if(stations[i].attributes){
				 $scope.markers.push({
					options: {
						draggable: false,
						icon: {
							url: retIconURL(stations[i].attributes.weather_icon),
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
						longitude: stations[i].attributes.coord_lon,
						latitude: stations[i].attributes.coord_lat,
					},
				});
			}
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

