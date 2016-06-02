import {MAIN_MODULE} from  './mainModule.js';


MAIN_MODULE.controller('securityCtrl', function ($scope, $meteor, $reactive, $rootScope, $state, IconService) {
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
        'gunshot': {icon: 'img/security/gunshot.png', text: 'Gunshot', name: 'gunshot',  checked: true},
        'stressedvoice': {icon: 'img/security/stressedvoice.png', text: 'Stressed Voice', name: 'stressedvoice', checked: false},
        'caralarm': {icon: 'img/security/caralarm.png', text: 'Car Alarm', name:'caralarm', checked: false},
        'brokenglass': {icon: 'img/security/brokenglass.png', text: 'Broken Glass', name:'brokenglass', checked: true},
        'caraccident': {
            icon: 'img/security/caraccident.png',
            text: 'Car accident',
            checked: true,
            name:'caraccident',
            style: 'margin-bottom: 20px'
        },
        'warninggeneral': {icon: 'img/security/warninggeneral.png', text: 'Critical Event', checked: false},
        'warningevacuation': {icon: 'img/security/warningfire2.png', text: 'Evacuation Notice', checked: false},
        'warningfire': {icon: 'img/security/warningfire.png', text: 'Fire Alarm', checked: false},
        'warningbombthreat': {icon: 'img/security/warningbombthreat.png', text: 'Bomb Threat', checked: false},
        'warninggasleak': {icon: 'img/security/Gas.png', text: 'Gas Leak', checked: false}
    };

    $scope.map = {
        center: {
            longitude: 5.48,
            latitude: 51.44,
        },
        zoom: 13,
        options: {
            disableDefaultUI: true
        }
    };

    $meteor.subscribe('P2000Pub');
    $meteor.subscribe('soundSensorPub');
    $scope.markers = [];
    $scope.range = { //Initial range slider value
        value : 24
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
        var dt = (new Date().getTime() - 1000*60*60*$scope.range.value).toString();


        selector['attributes.dt'] = {$gte: dt};
        selector['attributes.type'] = {$in: []};
        angular.forEach(eT,function (o) {
            if (o.checked) {
                selector['attributes.type']['$in'].push(o.name);
            }});
        if(selector['attributes.type']['$in'].length == 0){
            selector = {"falseValue" : "Do not show"};
        }

        return(selector);
    };

    $scope.helpers({	//Scope helpers to get from Meteor collections
        p2000Events(){
            return  P2000.find();
        },
        SoundEvents(){
            return  SoundSensor.find({}, {limit: 25});
        }
    });

    $scope.getIcon = function(arg2){

    }

    /**
     * @summary update scope to the currently selected event
     * @param event
     * @param arg
     */
    var setInfo = function (event, arg) { //Updates scope to the current selected p2000 event
        if (arg) {
            $state.go('security.subemergency');
            $scope.city = "Eindhoven";
            $scope.type = arg.type;
            $scope.title = arg.title;
            $scope.description = arg.description;
            $scope.publish_date = arg.publish_date;
            $scope.$apply();
        }
    };
    $scope.$on('setInfo', setInfo);

    /**
     * @summary Runs whenever the P2000 or any of the settings are updated. Pulls p2000 events and updates all UI elements
     */
    var reload = function () {
        var hack = $scope.getReactively('p2000Events');
        var hack2 = $scope.getReactively('SoundEvents');
        var selEvent = $scope.getReactively('p2000Debug');
        setInfo(null, $scope.loc);
        if (selEvent) {
            if (!$scope.map) {
                $scope.map = {
                    center: {
                        latitude: hack[0].attributes.coord_lat,
                        longitude: hack[0].attributes.coord_lng
                    },
                    zoom: 13,
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

        var events = P2000.find($scope.returnFilteredEvents()).fetch();
        events = events.concat(SoundSensor.find($scope.returnFilteredEvents()).fetch());


        $scope.markers = [];
        for (var i = 0; i < events.length; i++) {
            if (events[i].attributes) {
                var currentMarker = events[i].attributes;
                $scope.markers.push({
                    options: {
                        draggable: false,
                        icon: IconService.createMarkerIcon(events[i].attributes.type, 'security'),
                        type: currentMarker.type,
                        title: currentMarker.restTitle,
                        description: currentMarker.description,
                        publish_date: currentMarker.publish_date
                    },
                    events: {
                        click: (marker, eventName, args) => {
                            $rootScope.$broadcast('setInfo',marker);
                        },
                        dragend: (marker, eventName, args) => {
                            this.setLocation(marker.getPosition().lat(), marker.getPosition().lng());
                            $scope.$apply();
                        }
                    },
                    location: {
                        latitude: events[i].attributes.coord_lat,
                        longitude: events[i].attributes.coord_lng
                    },
                });
            } else {
                $scope.markers[i].setMap(null);
            }
        }
    }
    $scope.autorun(reload);
    $scope.$watch('eventTypes', reload, true);
    $scope.$watch('range.value', reload);

}).filter('convertHours', function(){
    /**
     * @summary convert integer amount of hours into a string with amount of days and hours
     * @return string hours/24+'d'+hours%24+'h'
     */
    return function(hours){
        if (Math.floor(hours/24) > 0){
            return Math.floor(hours/24)+'d'+hours%24+'h';
        }
        return hours%24 + 'h';
    }
})
