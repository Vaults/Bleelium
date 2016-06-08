import {MAIN_MODULE} from  './mainModule.js';

/** Mapping of MongoDB database collections*/
ParkingArea = new Mongo.Collection('ParkingArea');

/**
 * @summary Controller for the parking tab. Controls the sidebar in the parking tab as well as the icons on the map
 * @param $scope Angular scope
 * @param $meteor Angular meteor handle
 * @param $reactive Angular reactive component
 * @param $rootScope Angular root scope
 * @param IconService is used to set the marker icon
 */
//
MAIN_MODULE.controller('parkingCtrl', function ($scope, $meteor, $reactive, $rootScope, $state, IconService) {
    /** Attach this to the scope */
    $reactive(this).attach($scope);

    /** Subscribe parking data from server */
    $meteor.subscribe('parkingAreaPub');

    /** Scope helpers to get from Meteor collections */
    $scope.helpers({
        parkingArea(){
            /*console.log(ParkingArea.find({}))*/
            return ParkingArea.find({});
        }
    });

    /** Create a google map and adjust the view to Strijp-S*/
    $scope.map = {
        center: {
            longitude: 5.456732,
            latitude: 51.447146,
        },
        zoom: 16,
        options: {
            disableDefaultUI: true
        }
    };

    /** The percentage of use parking spaces */
    $scope.percent = 52;

    /** Function that changes the freeColor when the percentage changes
     * @var {string} changeColor
     */
    var changeColor = function() {
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

    /** TODO WHEN DB STRUCTURE IS DONE
     * @summary Updates the scope information to the current selected parking area when a marker is clicked
     * @param event Marker click event
     * @param arg ParkingArea information
     */
    var setInfo = function (event, arg) {
        if (arg) {
            $scope.latitude = lodash.round(arg.lat(), 2);
            $scope.longtitude = lodash.round(arg.lng(), 2);

            $scope.$apply();
        }
    };

    /**ui
     * @summary Runs whenever Parking settings are updated. Pulls Parking events and updates all UI elements
     */
    var reload = function () {
        var parkingAreas= $scope.getReactively('parkingArea');

        /** Remove old markers */
        $scope.markers = [];

        /** Create map markers for each of the parkingAreas */
        for (var i = 0; i < parkingAreas.length; i++) {
            if (parkingAreas[i].attributes) {
                var currentMarker = parkingAreas[i].attributes;
                $scope.markers.push({
                    options: {
                        draggable: false,
                        icon: IconService.createMarkerIcon('Parking', 'parking'),
                        type: currentMarker.type,
                        address: currentMarker.address,
                        name: currentMarker.name,
                        openingHours: currentMarker.openingHours,
                        price: currentMarker.price
                    },
                    events: {
                        click: (marker, eventName, args) => {
                            /** Set global variable to current parkingArea for use from other controllers */
                            $rootScope.$broadcast('setInfo', marker);
                        },
                        dragend: (marker, eventName, args) => {
                            this.setLocation(marker.getPosition().lat(), marker.getPosition().lon());
                            $scope.$apply();
                        }
                    },
                    location: {
                        longitude: currentMarker.coord_lon,
                        latitude: currentMarker.coord_lat,
                    },
                });
            } else {
                $scope.markers[i].setMap(null);
            }
        }
    }
    $scope.autorun(reload);
    
});