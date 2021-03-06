/**
 * Created by Marcel on 26-5-2016.
 */
import {HTTP} from 'meteor/http';
import {MAIN_MODULE} from  './mainModule.js';

/**
 * @summary Takes care of critical event pop-ups on any page
 * @param $scope Angular scope
 * @param $meteor Angular meteor handle
 * @param $reactive Angular reactive component
 * @param $rootScope Angular root scope
 * @param $state stores the current state of the system
 */
MAIN_MODULE.controller('eventCtrl', function ($state, $scope, $meteor, $reactive, $rootScope) {

    $meteor.subscribe('criticalEventsPub');
    $scope.helpers({	//Scope helpers to get data from Meteor collection
        criticalEvents(){
            return CriticalEvents.find({seenFlag: {$exists: false}});
        }
    });

    //Pop-up element in UI
    var popUpMulti = document.getElementById('pop-upMulti');

    $scope.events = {};


    /**
     * @summary Closes critical event pop-up window when 'X' is clicked and updates the seen flag
     */
    $scope.close = function () {
        popUpMulti.style.display = "none";

        for (k in $scope.events) {
            CriticalEvents.update({_id: $scope.events[k]._id}, {$set: {seenFlag: true}})
        }

        $scope.events = {};

    };

    /**
     * @summary Sends user to the security tab, when more information about a critical event is requested
     * @param event Critical event that is clicked
     */
    $scope.goToEvent = function(event){
        Meteor.setTimeout(function(){
            $rootScope.$broadcast('critEventSet', event);
        }, 1000);
        $scope.close();
        $state.go('security.sub');

    };

    /**
     * @summary When the collection is updated, the pop-up is displayed again if any event has seenFlag == false
     */
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
