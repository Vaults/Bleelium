import {MAIN_MODULE} from  './mainModule.js';


MAIN_MODULE.controller('securityCtrl', function ($scope, $meteor, $reactive, $rootScope, $state) {
    $reactive(this).attach($scope);
    $scope.eventTypes = {
        'policedept': {icon: 'img/security/policedept.png', text: 'Police Department', checked: false},
        'firedept': {icon: 'img/security/firedept.png', text: 'Fire Department', checked: false},
        'paramedics': {
            icon: 'img/security/paramedics.png',
            text: 'Paramedics',
            checked: true,
            style: 'margin-bottom: 20px'
        },
        'gunshot': {icon: 'img/security/gunshot.png', text: 'Gunshot', checked: false},
        'stressedvoice': {icon: 'img/security/stressedvoice.png', text: 'Stressed Voice', checked: false},
        'caralarm': {icon: 'img/security/caralarm.png', text: 'Car Alarm', checked: false},
        'brokenglass': {icon: 'img/security/brokenglass.png', text: 'Broken Glass', checked: false},
        'caraccident': {
            icon: 'img/security/caraccident.png',
            text: 'Car accident',
            checked: false,
            style: 'margin-bottom: 20px'
        },
        'warninggeneral': {icon: 'img/security/warninggeneral.png', text: 'Critical Event', checked: false},
        'warningevacuation': {icon: 'img/security/warningfire2.png', text: 'Evacuation Notice', checked: false},
        'warningfire': {icon: 'img/security/warningfire.png', text: 'Fire Alarm', checked: false},
        'warningbombthreat': {icon: 'img/security/warningbombthreat.png', text: 'Bomb Threat', checked: false},
        'warninggasleak': {icon: 'img/security/warninggasleak.png', text: 'Gas Leak', checked: false}
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
    $scope.markers = [];

    $scope.findEventInfo = function (loc) { //Finds an event from coordinates
        var selector = {
            'attributes.coord_lat': String(loc.lat()),
            //'attributes.coord_lng': loc.lng()
        };

        return P2000.findOne(selector);
    }

    $scope.helpers({	//Scope helpers to get from Meteor collections
        p2000Debug(){
            return P2000.findOne();
        },
        p2000Events(){
            return P2000.find();
        }
    });


    var setInfo = function (event, arg) { //Updates scope to the current selected p2000 event
        if (arg) {
            var loc = $scope.findEventInfo(arg);
            console.log(loc);
            $state.go('security.subemergency');
            $scope.city = "Eindhoven";
            $scope.title = loc.attributes.description;
            $scope.publish_date = loc.attributes.publish_date;
            $scope.$apply();
        }
    };
    $scope.$on('setInfo', setInfo);

    var reload = function () { //Runs whenever the p2000 collection is updated. Pulls all p2000 events and updates all UI elements
        var events = $scope.getReactively('p2000Events');
        var selEvent = $scope.getReactively('p2000Debug');
        setInfo(null, $scope.loc);
        if (selEvent) {
            if (!$scope.map) {
                $scope.map = {
                    center: {
                        latitude: events[i].attributes.coord_lat,
                        longitude: events[i].attributes.coord_lng
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

        console.log($scope.eventTypes.paramedics.checked);
        if($scope.eventTypes.paramedics.checked) {
            $scope.markers = [];
            for (var i = 0; i < events.length; i++) {
                if (events[i].attributes) {
                    //console.log($scope.markers);
                    $scope.markers.push({
                        options: {
                            draggable: false,
                            icon: {
                                url: '/img/security/paramedics.png',
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
                            latitude: events[i].attributes.coord_lat,
                            longitude: events[i].attributes.coord_lng
                        },
                    });
                } else {
                    $scope.markers[i].setMap(null);
                }
            }
        }else{
            $scope.markers = [];
        }
    }
    $scope.autorun(reload);
    $scope.$watch('eventTypes.paramedics.checked', reload);

})