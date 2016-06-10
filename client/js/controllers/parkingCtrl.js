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
 * @param aggregateParking is used for the parking space aggregation to get the occupancy values
 */
MAIN_MODULE.controller('parkingCtrl', function ($scope, $meteor, $reactive, $rootScope, $state, IconService, aggregateParking) {
    /** Make scope reactive scope */
    $reactive(this).attach($scope);

    /** Subscribe parking data from server */
    $meteor.subscribe('parkingAreaPub');

    /** Scope helpers to get from Meteor collections */
    $scope.helpers({
        parkingArea(){
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

    $scope.percent=10;

    /** Function that changes the freeColor in the percentage circle when the percentage changes
     * @var {string} changeColor
     */
    var changeColor = function() {
        if ($scope.percent <= 100) {
            if ($scope.percent <= 50) {
                $scope.freeColor = 'green';
            }
            else if ($scope.percent > 50 && $scope.percent < 100) {
                $scope.freeColor = 'orange';
            }
            else {
                $scope.freeColor = 'red';
            }
        }
        console.log($scope.percent);
    }
    //$scope.autorun(changeColor);

    /** Defines the colors of percentage circle */
    $scope.color = {
        center : 'white',
        highlight: $scope.freeColor,
        remaining : 'lightGrey'
    }

    Meteor.call('aggregateParking', function(error, result){
        if(error !== null) {
            $scope.capacity = result['spaces']['total'];
            $scope.occupied = result['occupied']['total'];
        }
    })

    /**
     * @summary Updates the scope information to the current selected parking area when a marker is clicked
     * @param event Marker click event
     * @param arg ParkingArea information
     */
    var setInfo = function (event, arg) {
        if (arg) {
            $scope.latitude = lodash.round(arg.lat, 2);
            $scope.longtitude = lodash.round(arg.lon, 2);
            $scope.address = arg.address; //parking address name
            var d = new Date(); //get the date
            var weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]; //define days
            $scope.day = weekday[d.getDay()]; //day of the week
            $scope.openingHours = arg.openingHours.split("|")[d.getDay()]; //get the opening hours for the current day
            var price = arg.price.split("_"); //splits the price entry to the hourly and daily prices
            $scope.pricehour = price[0]; //hourly fee
            $scope.priceday = price[1]; //daily fee

            var result = aggregateParking();
            $scope.capacity = result['spaces'][arg.index]; //get the amount of parking spaces for this parking area
            $scope.occupied = result['occupied'][arg.index]; //get current occupancy number for this parking area
            $scope.percent = Math.round(($scope.occupied/$scope.capacity)*100); //update current occupancy percentage
            $scope.autorun(changeColor);
            $scope.$apply();
        }
    };

    /** Call setinfo when it's broadcasted */
    $scope.$on('setInfo', setInfo);

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
                        address: currentMarker.address,
                        openingHours: currentMarker.openingHours,
                        price: currentMarker.price,
                        index: i
                    },
                    events: {
                        click: (marker, eventName, args) => {
                            /** Set global variable to current parkingArea for use from other controllers */
                            $rootScope.$broadcast('setInfo', marker);
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
    $scope.$watch('percent', reload);
});