/**
 * Created by Marcel on 26-5-2016.
 */
import {MAIN_MODULE} from  './mainModule.js';
MAIN_MODULE.controller('eventCtrl', function($scope, $meteor, $reactive, $rootScope) {

    var popUpMulti = document.getElementById('pop-upMulti');

    $scope.events = [
        {
            coord: {
                lot: 5.487589,
                lat: 51.447835
            },
            street: "Woenselse Watermolen",
            description: {
                name: "Bomb Threat",
                sensor: "bomb detector",
                level: 9
            },
            time: 1530,
            date: 24052016,
            view: true,
            icon: "warningbombthreat"
        },
        {
            coord: {
                lot: 5.487589,
                lat: 51.447835
            },
            street: "Gildebuurt",
            description: {
                name: "Gas Leak",
                sensor: "gas detector",
                level: 10
            },
            time: 1630,
            date: 24052016,
            view: true,
            icon: "warninggasleak"
        },
        {
            coord: {
                lot: 5.487589,
                lat: 51.447835
            },
            street: "Witte Dame",
            description: {
                name: "Car Accident",
                sensor: "sound sensor",
                level: 7
            },
            time: 1730,
            date: 24052016,
            view: true,
            icon: "warninggeneral"
        }
    ]

    //fina the event with maximum level
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
    if ($scope.events.length != 0) {
        popUpMulti.style.display = "block";
    }

    //Close the pop-up windows when click on the x
    $scope.close = function () {
        popUpMulti.style.display = "none";
    }
});
