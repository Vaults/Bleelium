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
MAIN_MODULE.controller('parkingCtrl', function ($scope, $meteor, $reactive, $rootScope, $state, IconService, aggregateParking, circleHandler, ParkingService, util) {
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
    $scope.map = util.map;

    /** Defines the colors of percentage circle */
    $scope.color = ParkingService.color;


    /**
     * @summary Updates the scope information to the current selected parking area when a marker is clicked
     * @param event Marker click event
     * @param arg ParkingArea information
     */
    var setInfo = function (event, arg) {
        //console.log(arg);
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
            circleHandler($scope, arg.index);
            //Set parking info for detail view
            ParkingService.setInfo(Object.keys(arg.lots)[0], arg);
            //$scope.$apply();
        }
    };

    /** Call setinfo when it's broadcasted */
    $scope.$on('setInfo', setInfo);

    /**ui
     * @summary Runs whenever Parking settings are updated. Pulls Parking events and updates all UI elements
     */
    var reload = function () {
        var parkingAreas= $scope.getReactively('parkingArea');

        /** Create map markers for each of the parkingAreas */
        var optFunc = function(opts, obj){
            opts['icon'] = IconService.createMarkerIcon('Parking', 'parking');
            opts['name'] = obj.attributes.name;
            opts['address'] = obj.attributes.address;
            opts['openingHours'] = obj.attributes.openingHours;
            opts['price'] = obj.attributes.price;
            opts['index'] = obj._id;
            opts['lots'] = obj.parkingLots;
            return opts;
        }
        var markerFunc = (marker) => {
                $rootScope.$broadcast('setInfo', marker);
        };

        $scope.markers = util.calculateMarkers(parkingAreas, $scope.markers, optFunc, markerFunc);
       
        //If no marker has been clicked yet, load the data from the zeroth marker
        if(!$scope.latitude && $scope.markers[0]){
            setInfo(null, $scope.markers[0].options);
        }
    };
    $scope.autorun(reload);
});