import {MAIN_MODULE} from  './mainModule.js';

/**
 * @summary Controller for the parking tab
 */
MAIN_MODULE.controller('parkingCtrl', function ($scope, $meteor, $reactive) {
    //Create a google map
    $scope.map = {
        center: {
            longitude: 5.4500238,
            latitude: 51.4523127,
        },
        zoom: 15,
        events: {
            click: (mapModel, eventName, originalEventArgs) => {
                $scope.$apply();
            }
        },
        options: {
            disableDefaultUI: true
        }
    };

    //The percentage of free spaces
    $scope.percent = 100;

    //Function that changes the freeColor when the percentage changes
    var changeColor = function() {
        if ($scope.percent <= 100) {
            if ($scope.percent < 50) {
                $scope.freeColor = 'green';
            }
            else if ($scope.percent > 50 & $scope.percent != 100) {
                $scope.freeColor = 'orange';
            }
            else {
                $scope.freeColor = 'red';
            }
        }
    }
    $scope.autorun(changeColor)

    //Define the colors of percentage circle
    $scope.color = {
        center : 'white', 
        highlight: $scope.freeColor,
        remaining : 'lightGrey'
    }
    
});