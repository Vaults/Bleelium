import {HTTP} from 'meteor/http';
import {MAIN_MODULE} from  './mainModule.js';


MAIN_MODULE.controller('indexCtrl', function ($scope, $meteor, $reactive, $rootScope, WeatherService, IconService, aggregateParking, circleHandler) {
    $meteor.subscribe('weatherPub');
    $meteor.subscribe('P2000Pub');
    $meteor.subscribe('soundSensorPub');
    $meteor.subscribe('criticalEventsPub');
    $meteor.subscribe('parkingAreaPub');

    $scope.helpers({	//Scope helpers to get from Meteor collections
        weatherStations(){
            return WeatherStations.find({});
        },
        parkingArea(){
            return ParkingArea.find({});
        }
    });
    /**
     * @summary Find a weatherstation based on geolocation
     * @param loc object with attributes 'attributes.coord_lat' and 'attributes.coord_lon'
     * @returns WeatherStation
     */
    $scope.findWeatherStationInfo = function (loc) { //Finds a weather station from coordinates
        var selector = {
            'attributes.coord_lat': String(lodash.round(loc.lat(), 2)),
            'attributes.coord_lon': String(lodash.round(loc.lng(), 2))
        };
        return WeatherStations.findOne(selector);
    }

    /**
     * @summary Updates the scope information when a marker is clicked
     * @param event Marker click event
     * @param arg WeatherStation information
     */
    var setInfo = function (event, arg) { //Updates scope to the current selected weatherstation
        if (arg) {
            var loc = $scope.findWeatherStationInfo(arg);
            $scope.weather_loc = arg;
            WeatherService.weatherLocation = { //Set a global variable with current location
                'attributes.coord_lat': '' + lodash.round(arg.lat(), 2),
                'attributes.coord_lon': '' + lodash.round(arg.lng(), 2)
            };
            $scope.weather_date = loc.attributes.date;
            $scope.weather_name = loc.attributes.name;
            $scope.weather_latitude = lodash.round(arg.lat(), 2);
            $scope.weather_longtitude = lodash.round(arg.lng(), 2);
            $scope.weather_temperature = lodash.round(loc.attributes.temp, 2);
            $scope.weather_min = lodash.round(loc.attributes.temp_min, 2);
            $scope.weather_max = lodash.round(loc.attributes.temp_max, 2);
            $scope.weather_windDegrees = loc.attributes.wind_deg;
            //$scope.windDirection = getWindDir(loc.attributes.wind_deg);
            $scope.weather_Airpressure = lodash.round(loc.attributes.pressure);
            $scope.weather_Humidity = lodash.round(loc.attributes.humidity);
            $scope.weather_sunrise = loc.attributes.sunrise;
            $scope.weather_sunset = loc.attributes.sunset;
            $scope.weather_iconURL = IconService.retIconUrl(loc.attributes.weather_icon, 'weather');
            //$scope.$apply();
        }
    };

    //When setInfo is broadcasted, call setInfo function
    $scope.$on('setInfo', setInfo);
    /**
     * @summary Make a location objects with latitude and longitude fields
     * @param latitude
     * @param longitude
     * @returns Object with latitude and longitude
     */
    $scope.makeLocation = function (latitude, longitude) {
        return {
            latitude,
            longitude
        }
    };


    /**
     * @summary Runs whenever weatherstation collection is updated. Pulls weatherstations and updates UI elements accordingly
     */
    var reload = function () {
        console.log($scope.getReactively('parkingArea'));
        var selStation = WeatherStations.findOne({"_id": "2756253"});
        if (selStation && !$scope.name) {
                var temp = {
                    lat: function(){
                        return '51.44';

                    },
                    lng: function(){
                        return '5.48';
                    }
                };
                setInfo(null, temp);
        }
        var lastDaySel = function(sel){
            var time = new Date().getTime() - 24*60*60*1000;
            sel['attributes.dt'] = {$gte: time+''};
            return sel;
        };

        circleHandler($scope);
        console.log($scope.capacity);


        $scope.eventTypes = {
            'policedept': {
                icon: 'img/security/Politie.png',
                text: 'Police Department',
                name: 'Politie',
                count: P2000.find(lastDaySel({'attributes.type': 'politie'})).count()
            },
            'firedept': {
                icon: 'img/security/brandweer.png',
                text: 'Fire Department',
                name: 'brandweer',
                count: P2000.find(lastDaySel({'attributes.type': 'brandweer'})).count()
            },
            'paramedics': {
                icon: 'img/security/Ambulance.png',
                text: 'Paramedics',
                name: 'Ambulance',
                count: P2000.find(lastDaySel({'attributes.type': 'Ambulance'})).count()
            },
            'gunshot': {icon: 'img/security/gunshot.png', text: 'Gunshot', name: 'gunshot', count: SoundSensor.find(lastDaySel({'attributes.type': 'gunshot'})).count()},
            'stressedvoice': {icon: 'img/security/stressedvoice.png', text: 'Stressed Voice', name: 'stressedvoice', count: SoundSensor.find(lastDaySel({'attributes.type': 'stressedvoice'})).count()},
            'caralarm': {icon: 'img/security/caralarm.png', text: 'Car Alarm', name:'caralarm', count: SoundSensor.find(lastDaySel({'attributes.type': 'caralarm'})).count()},
            'brokenglass': {icon: 'img/security/brokenglass.png', text: 'Broken Glass', name:'brokenglass', count: SoundSensor.find(lastDaySel({'attributes.type': 'brokenglass'})).count()},
            'caraccident': {
                icon: 'img/security/caraccident.png',
                text: 'Car accident',
                name:'caraccident',
                count: SoundSensor.find(lastDaySel({'attributes.type': 'caraccident'})).count()
            },
            'warninggasleak': {icon: 'img/security/Gas.png', text: 'Gas Leak', name:'Gas', count: CriticalEvents.find(lastDaySel({'attributes.type': 'Gas'})).count()},
            'warningsmoke': {icon: 'img/security/Smoke.png', text: 'Smoke', name:'Smoke', count: CriticalEvents.find(lastDaySel({'attributes.type': 'Smoke'})).count()}
        };
    }
    $scope.autorun(reload)


});
