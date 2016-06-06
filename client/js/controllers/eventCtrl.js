/**
 * Created by Marcel on 26-5-2016.
 */
import {HTTP} from 'meteor/http';
import {MAIN_MODULE} from  './mainModule.js';


MAIN_MODULE.controller('eventCtrl', function ($scope, $meteor, $reactive, $rootScope) {

    $meteor.subscribe('criticalEventsPub');
    $scope.helpers({	//Scope helpers to get from Meteor collections
        criticalEvents(){
            return CriticalEvents.find({seenFlag: {$exists: false}});
        }
    });

    var popUpMulti = document.getElementById('pop-upMulti');

    $scope.events = {};

    /**
     *
     * @param events
     * @returns {*}
     */
    function getMaxLevel(events) {
        var maxLevel = 0;
        for (i = 0; i < events.length; i++) {
            if (events[i].description.level >= events[maxLevel].description.level) {
                maxLevel = i;
            }
        }
        return events[maxLevel];
    }

    //Close the pop-up windows when click on the x
    $scope.close = function () {
        popUpMulti.style.display = "none";

        for (k in $scope.events) {
            console.log($scope.events[k]);
            CriticalEvents.update({_id: $scope.events[k]._id}, {$set: {seenFlag: true}})
        }

        $scope.events = {};

    };

    var reload = function () {
        $reactive(this).attach($scope);
        var events = $scope.getReactively('criticalEvents');

        if ($scope.events) {
            if (Object.keys($scope.criticalEvents).length > 0) {
                popUpMulti.style.display = "block";
            }
        }

        angular.forEach($scope.criticalEvents, function (o) {
            $scope.events[o._id] = o;

            if (o.attributes.type == 'Gas') {
                for (var prop in o.attributes.gases) {
                    o.TOG = prop;
                    o.level = o.attributes.gases[prop];
                }
            }else if (o.attributes.type == 'Smoke') {
                    o.level = o.attributes.smoke; }

        });
    };
    $scope.autorun(reload)

});
