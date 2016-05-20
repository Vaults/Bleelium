import {MAIN_MODULE} from  './mainModule.js';

MAIN_MODULE.controller('weatherCtrl', function($scope, $meteor, $reactive, $rootScope, WeatherService) {

    $meteor.subscribe('weatherPub');
    $scope.markers = [];

    $scope.helpers({	//Scope helpers to get from Meteor collections
        weatherStationDebug(){
            return WeatherStations.findOne({"id": "2756253"});
        },
        weatherStations(){
            return WeatherStations.find({});
        }
    });


    $scope.findWeatherStationInfo = function (loc) { //Finds a weather station from coordinates
        var selector = {
            'attributes.coord_lat': String(lodash.round(loc.lat(), 2)),
            'attributes.coord_lon': String(lodash.round(loc.lng(), 2))
        };
        return WeatherStations.findOne(selector);
    }
    var sanitizeStr = function (dirty) {	//Cleans a string to prevent filepath exploits
        var clean = lodash.replace(dirty, '/', '');
        var cleaner = lodash.replace(clean, '.', '');
        return cleaner;
    }
    var retIconURL = function (str) {	//returns an image for a certain image id
        return '/img/weather/' + sanitizeStr(str) + '.png';
    }

    var setInfo = function (event, arg) { //Updates scope to the current selected weatherstation
        if (arg) {
            var loc = $scope.findWeatherStationInfo(arg);
            //console.log(loc);

            $scope.loc = arg;
            WeatherService.weatherLocation = {'attributes.coord_lat': ''+lodash.round(arg.lat(), 2), 'attributes.coord_lon': ''+lodash.round(arg.lng(), 2)};
            $scope.date = loc.attributes.date;
            $scope.name = loc.attributes.name;
            $scope.latitude = lodash.round(arg.lat(), 2);
            $scope.longtitude = lodash.round(arg.lng(), 2);
            $scope.temperature = lodash.round(loc.attributes.temp, 2);
            $scope.min = lodash.round(loc.attributes.temp_min, 2);
            $scope.max = lodash.round(loc.attributes.temp_max, 2);
            $scope.windDegrees = loc.attributes.wind_deg;
                $scope.windDirection = getWindDir(loc.attributes.wind_deg);
             $scope.Airpressure = lodash.round(loc.attributes.pressure);
             $scope.Humidity = lodash.round(loc.attributes.humidity);
             $scope.sunrise = loc.attributes.sunrise;
             $scope.sunset = loc.attributes.sunset;
             $scope.iconURL = retIconURL(loc.attributes.weather_icon);
             $scope.$apply();

        }
    };

    var getWindDir = function (degrees) {	//gets Wind Direction from a degree
        Meteor.call('findWindDir', degrees, function (error, result) {
            if (!error) {
                $scope.windDirection = result;
            }
        })
    }



    $scope.$on('setInfo', setInfo);
    $scope.setLocation = function (latitude, longitude) {
        return {
            latitude,
            longitude
        }
    };


    var reload = function () { //Runs whenever the weatherstation collection is updated. Pulls all weatherstations and updates all UI elements
        $reactive(this).attach($scope);
        var selStation = $scope.getReactively('weatherStationDebug');
        var stations = $scope.getReactively('weatherStations');
        setInfo(null, $scope.loc);
        if (selStation) {
            if (!$scope.map) {
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
        for (var i = 0; i < stations.length; i++) {
            if (stations[i].attributes) {
                $scope.markers.push({
                    options: {
                        draggable: false,
                        icon: {
                            url: retIconURL(stations[i].attributes.weather_icon),
                            size: {
                                height: 600,
                                width: 600
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


}).controller('parkingCtrl', function ($scope, $meteor, $reactive) {

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
}).controller('forecastCtrl', function ($scope, $meteor, $reactive, $rootScope, WeatherService) {
    $meteor.subscribe('weatherPub');
    //Load the name and coordinates for this location
    var loc = WeatherStations.findOne(WeatherService.weatherLocation);
    console.log(WeatherService.weatherLocation["attributes.coord_lon"]);
    $scope.name = loc.attributes.name;
    $scope.longitude = WeatherService.weatherLocation["attributes.coord_lon"];
    $scope.latitude = WeatherService.weatherLocation["attributes.coord_lat"];

    //Get the forecast info
    $scope.forecastInfo = [
        {
            date: '1463742000',
            min: 12,
            max: 14,
            windDegrees: 180,
            windDirection: 'NE',
            airPressure: 1012,
            humidity: 10
        },
        {
            date: 'date',
            min: 'min',
            max: 'max',
            windDegrees: '56',
            windDirection: 'NE',
            airPressure: 'airPressure',
            humidity: 'humidity'
        },
        {
            date: 'date',
            min: 'min',
            max: 'max',
            windDegrees: 270,
            windDirection: 'NE',
            airPressure: 'airPressure',
            humidity: 'humidity'
        },
        {
            date: 'date',
            min: 'min',
            max: 'max',
            windDegrees: '180',
            windDirection: 'NE',
            airPressure: 'airPressure',
            humidity: 'humidity'
        },
        {
            date: 'date',
            min: 'min',
            max: 'max',
            windDegrees: 90,
            windDirection: 'NE',
            airPressure: 'airPressure',
            humidity: 'humidity'
        }
    ];
});
