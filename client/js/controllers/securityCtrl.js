import {MAIN_MODULE} from  './mainModule.js';

P2000 = new Mongo.Collection('P2000');
SoundSensor = new Mongo.Collection('SoundSensor');
CriticalEvents = new Mongo.Collection('criticalEvents');

/**
 * @summary Controller for the security tab. Controls the sidebar in the security tab as well as the icons on the map
 * @param $scope Angular scope
 * @param $meteor Angular meteor handle
 * @param $reactive Angular reactive component
 * @param $rootScope Angular root scope
 * @param $state UI router state used to switch state
 * @param IconService is used to set the marker icon
 * @param util utilities for map
 */
MAIN_MODULE.controller('securityCtrl', function ($scope, $meteor, $reactive, $rootScope, $state, $stateParams, IconService, util) {
    $reactive(this).attach($scope);

    $meteor.subscribe('P2000Pub');
    $meteor.subscribe('soundSensorPub');
    $meteor.subscribe('criticalEventsPub');
    $scope.markers = [];
    $scope.range = { //Initial range slider value
        value: 24
    }
    $scope.eventTypes = util.eventTypes;

    /**
     * @summary find one specific event based on location
     * @param loc
     * @returns P2000 event
     */
    $scope.findEventInfo = function (loc) { //Finds an event from coordinates
        var selector = {
            'attributes.coord_lat': String(loc.lat()),
        };

        return P2000.findOne(selector);
    }

    /**
     * @summary generates a selector for the P2000 search query
     * @returns selector with types of events to get and date constraint
     */
    $scope.returnFilteredEvents = function () {
        var selector = {};
        var eT = $scope.eventTypes;
        var dt = (new Date().getTime() - 1000 * 60 * 60 * $scope.range.value).toString();


        selector['attributes.dt'] = {$gte: dt};
        selector['attributes.type'] = {$in: []};
        angular.forEach(eT, function (o) {
            if (o.checked) {
                selector['attributes.type']['$in'].push(o.name);
            }
        });
        if (selector['attributes.type']['$in'].length == 0) {
            selector = {"falseValue": "Do not show"};
        }

        return selector;
    };

    $scope.helpers({	//Scope helpers to get from Meteor collections
        p2000Events(){
            return P2000.find();
        },
        SoundEvents(){
            return SoundSensor.find({}, {limit: 25});
        },
        CriticalEvents(){
            return CriticalEvents.find({});
        }
    });

    /**
     * @summary update scope to the currently selected event
     * @param arg marker options
     */
    util.initSetInfo($scope, function(arg){
            $state.go('security.subemergency');
            $scope.city = "Eindhoven";
            $scope.type = arg.type;
            $scope.title = arg.title;
            $scope.description = arg.description;
            $scope.publish_date = arg.publish_date;
            $scope.$apply();
    });

    $scope.map = util.map;

    /**
     * @summary Zooms and loads critical event when info button is clicked on homepage
     */
    $rootScope.$on('critEventSet', function (event, args) {
        $scope.map = {
            center: {
                longitude: args.attributes.coord_lng,
                latitude: args.attributes.coord_lat
            },
            zoom: 15
        };

        var mark={};
        $scope.markers.forEach(function(o){
           if(o.location.longitude == args.attributes.coord_lng){
               mark = o;
           }
        });
        $rootScope.$broadcast('setInfo', mark.options);
    });

    /**
     * @summary Runs whenever the P2000 or any of the settings are updated. Pulls p2000 events and updates all UI elements
     */
    var reload = function () {
        var hack = $scope.getReactively('p2000Events');
        var hack2 = $scope.getReactively('SoundEvents');
        var hack3 = $scope.getReactively('criticalEvents');
        $rootScope.$broadcast('setInfo', $scope.loc);
        var events = P2000.find($scope.returnFilteredEvents()).fetch();
        events = events.concat(SoundSensor.find($scope.returnFilteredEvents()).fetch());
        events = events.concat(CriticalEvents.find($scope.returnFilteredEvents()).fetch());
        /**
         * @summary Create map markers for each of the security events
         * @param opts options to set in each marker
         * @param obj security event object
         * @returns options to set in marker
         */
        var optFunc = function(opts, obj){
            opts['icon'] = IconService.createMarkerIcon(obj.attributes.type, 'security'),
            opts['type'] = obj.attributes.type,
            opts['title'] = obj.attributes.restTitle,
            opts['description'] = obj.attributes.description,
            opts['publish_date'] = obj.attributes.publish_date
            return opts;
        };

        /**
         * @summary Click event for marker
         * @param marker
         */
        var markerFunc = (marker) => {
            $rootScope.$broadcast('setInfo', marker);
        };
        $scope.markers = util.calculateMarkers(events, $scope.markers, optFunc, markerFunc);

    }
    $scope.autorun(reload);
    $scope.$watch('eventTypes', reload, true);
    $scope.$watch('range.value', reload);

});