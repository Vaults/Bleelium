/**
 * Created by Marcel on 26-5-2016.
 */
import {HTTP} from 'meteor/http';
import {MAIN_MODULE} from  './mainModule.js';

CriticalEvents = new Mongo.Collection('criticalEvents');

MAIN_MODULE.controller('eventCtrl', function($scope, $meteor, $reactive, $rootScope) {

    $meteor.subscribe('criticalEventsPub');
    $scope.helpers({	//Scope helpers to get from Meteor collections
        criticalEvents(){
            return CriticalEvents.find({});
        }
    });

    var popUpMulti = document.getElementById('pop-upMulti');

    $scope.events = [];

    //finalize the event with maximum level
    function getMaxLevel(events) {
        var maxLevel = 0;
        for (i = 0; i < events.length; i++) {
            if (events[i].description.level >= events[maxLevel].description.level) {
                maxLevel = i;
            }
        }
        return events[maxLevel];
    }

    // When the event array is not empty, the warning window will pop up

    //Close the pop-up windows when click on the x
    $scope.close = function () {
        popUpMulti.style.display = "none";
    };

    var reload = function () {
        $reactive(this).attach($scope);
        var events = $scope.getReactively('criticalEvents');

        if ($scope.events.length != 0) {
            for(i = 0; i < events.length ; i++){
                $scope.events[i].type = $scope.criticalEvents[i]['data']['type']
                $scope.events[i].gases = $scope.criticalEvents[i]['data']['gases']
                $scope.events[i].time = $scope.criticalEvents[i]['data']['time']
                $scope.events[i].coord_lat = $scope.criticalEvents[i]['data']['coord_lat']
                $scope.events[i].coord_lng = $scope.criticalEvents[i]['data']['coord_lon']
            }
            popUpMulti.style.display = "block";
        }

        $scope.events.push($scope.criticalEvents);
        console.log($scope.events)

    };
    $scope.autorun(reload)
    
});
