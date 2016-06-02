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

    $scope.events = {};

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

        angular.forEach($scope.criticalEvents,function(o){
            $scope.events[o._id] = o;
        })

        if ($scope.events != null) {
            popUpMulti.style.display = "block";
        }
        console.log($scope.events[0])

    };
    $scope.autorun(reload)
    
});
