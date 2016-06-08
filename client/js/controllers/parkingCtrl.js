import {MAIN_MODULE} from  './mainModule.js';

/** Mapping of MondoDB database collections*/
ParkingArea = new Mongo.Collection('ParkingArea');
ParkingLot = new Mongo.Collection('ParkingLot');
ParkingSpace = new Mongo.Collection('ParkingSpace');

/**
 * @summary Controller for the parking tab. Controls the sidebar in the parking tab as well as the icons on the map
 * @param $scope Angular scope
 * @param $meteor Angular meteor handle
 * @param $reactive Angular reactive component
 * @param $rootScope Angular root scope
 * @param WeatherService stores the location of the currently selected weather station
 * @param IconService is used to set the marker icon
 */
MAIN_MODULE.controller('parkingCtrl', function ($scope, $meteor, $reactive, $rootScope, $state, $IconService) {
    /** Attach this to the scope */
    $reactive(this).attach($scope);

    $meteor.subscribe('parkingAreaPub');
    $meteor.subscribe('parkingLotPub');
    $meteor.subscribe('ParkingSpacePub');

    $scope.helpers({	//Scope helpers to get from Meteor collections
        parkingArea(){
            console.log(ParkingArea.find({}))
            return ParkingArea.find({});
        },
        parkingLot(){
            return ParkingLot.find({});
        },
        parkingSpace(){
            return ParkingSpace.find({});
        }
    });
    
    //Create a google map
    $scope.map = {
        center: {
            longitude: 5.456732,
            latitude: 51.447146,
        },
        zoom: 16,
        events: {
            click: (mapModel, eventName, originalEventArgs) => {
                $scope.$apply();
            }
        },
        options: {
            disableDefaultUI: true
        }
    };



    /** TODO WHEN DB STRUCTURE IS DONE
     * @summary Updates the scope information when a marker is clicked
     * @param event Marker click event
     * @param arg ParkingArea information
     */
    var setInfo = function (event, arg) { //Updates scope to the current selected parking area
        if (arg) {
            $scope.latitude = lodash.round(arg.lat(), 2);
            $scope.longtitude = lodash.round(arg.lng(), 2);
            $scope.$apply();
        }
    };

    /**
     * @summary Runs whenever Parking settings are updated. Pulls Parking events and updates all UI elements
     */
    var reload = function () {
        var parkings = $scope.getReactively('parkingAreas');

        /** Create map markers for each parkingArea */
        $scope.markers = [];
        for (var i = 0; i < parkings.length; i++) {
            if (parkings[i].attributes) {
                $scope.markers.push({
                    options: {
                        draggable: false,
                        icon: IconService.createMarkerIcon(parkings[i].attributes.parking_icon, 'pearking')
                    },
                    events: {
                        click: (marker, eventName, args) => {
                            //Set global variable to current weatherstation for use from other controllers
                            $rootScope.$broadcast('setInfo', marker.getPosition());
                        }
                    },
                    location: {
                        longitude: parkings[i].attributes.coord_lon,
                        latitude: parkings[i].attributes.coord_lat,
                    },
                });
            }
        }
    }
    $scope.autorun(reload)

    /** The percentage of free spaces */
    $scope.percent = 100;

    /** Function that changes the freeColor when the percentage changes
     * @var {string} changeColor
     */
    var changeColor = function() {
        console.log($scope.parkingArea);
        if ($scope.percent <= 100) {
            if ($scope.percent <= 50) {
                $scope.freeColor = 'green';
            }
            else if ($scope.percent > 50 & $scope.percent != 100) {
                $scope.freeColor = 'orange';
            }
            else {
                $scope.freeColor = 'red';
            }
        }
    }
    $scope.autorun(changeColor)

    /** Defines the colors of percentage circle */
    $scope.color = {
        center : 'white', 
        highlight: $scope.freeColor,
        remaining : 'lightGrey'
    }
    
});