import {MAIN_MODULE} from  './mainModule.js';

P2000 = new Mongo.Collection('P2000');
SoundSensor = new Mongo.Collection('SoundSensor');
CriticalEvents = new Mongo.Collection('criticalEvents');

MAIN_MODULE.controller('securityCtrl', function ($scope, $meteor, $reactive, $rootScope, $state, $stateParams, IconService, util) {
    $reactive(this).attach($scope);
    $scope.eventTypes = {
        'policedept': {
            icon: 'img/security/Politie.png',
            text: 'Police Department',
            name: 'Politie',
            checked: true
        },
        'firedept': {
            icon: 'img/security/brandweer.png',
            text: 'Fire Department',
            name: 'brandweer',
            checked: true
        },
        'paramedics': {
            icon: 'img/security/Ambulance.png',
            text: 'Paramedics',
            name: 'Ambulance',
            checked: false,
            style: 'margin-bottom: 20px'
        },
        'gunshot': {icon: 'img/security/gunshot.png', text: 'Gunshot', name: 'gunshot', checked: true},
        'stressedvoice': {
            icon: 'img/security/stressedvoice.png',
            text: 'Stressed Voice',
            name: 'stressedvoice',
            checked: false
        },
        'caralarm': {icon: 'img/security/caralarm.png', text: 'Car Alarm', name: 'caralarm', checked: false},
        'brokenglass': {icon: 'img/security/brokenglass.png', text: 'Broken Glass', name: 'brokenglass', checked: true},
        'caraccident': {
            icon: 'img/security/caraccident.png',
            text: 'Car accident',
            checked: true,
            name: 'caraccident',
            style: 'margin-bottom: 20px'
        },
        'warninggeneral': {icon: 'img/security/warninggeneral.png', text: 'Critical Event', checked: true},
        'warningevacuation': {icon: 'img/security/warningfire2.png', text: 'Evacuation Notice', checked: false},
        'warningfire': {icon: 'img/security/warningfire.png', text: 'Fire Alarm', checked: false},
        'warningbombthreat': {icon: 'img/security/warningbombthreat.png', text: 'Bomb Threat', checked: false},
        'warninggasleak': {icon: 'img/security/Gas.png', text: 'Gas Leak', name: 'Gas', checked: true},
        'warningsmoke': {icon: 'img/security/Smoke.png', text: 'Smoke', name: 'Smoke', checked: true}
    };

    $meteor.subscribe('P2000Pub');
    $meteor.subscribe('soundSensorPub');
    $meteor.subscribe('criticalEventsPub');
    $scope.markers = [];
    $scope.range = { //Initial range slider value
        value: 24
    }

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

        return (selector);
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

    $scope.getIcon = function (arg2) {

    }

    /**
     * @summary update scope to the currently selected event
     * @param event
     * @param arg
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

    $rootScope.$on('critEventSet', function (event, args) {
        console.log(args);
        $scope.map = {
            center: {
                longitude: args.attributes.coord_lng,
                latitude: args.attributes.coord_lat
            },
            zoom: 15
        }

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
        var optFunc = function(opts, obj){
            opts['icon'] = IconService.createMarkerIcon(obj.attributes.type, 'security'),
            opts['type'] = obj.attributes.type,
            opts['title'] = obj.attributes.restTitle,
            opts['description'] = obj.attributes.description,
            opts['publish_date'] = obj.attributes.publish_date
            return opts;
        };
        var markerFunc = (marker) => {
            $rootScope.$broadcast('setInfo', marker);
        };
        $scope.markers = util.calculateMarkers(events, $scope.markers, optFunc, markerFunc);

    }
    $scope.autorun(reload);
    $scope.$watch('eventTypes', reload, true);
    $scope.$watch('range.value', reload);

});