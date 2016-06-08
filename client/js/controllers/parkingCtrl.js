import {MAIN_MODULE} from  './mainModule.js';

/**
 * @summary Controller for the parking tab
 */

ParkingArea = new Mongo.Collection('ParkingArea');

MAIN_MODULE.controller('parkingCtrl', function ($scope, $meteor, $reactive) {
    $reactive(this).attach($scope);
    $meteor.subscribe('parkingAreaPub');

    $scope.helpers({	//Scope helpers to get from Meteor collections
        parkingArea(){
            return ParkingArea.find({}.fetch());
        }
    });
    
    //Create a google map
    $scope.map = {
        center: {
            longitude: 5.4500238,
            latitude: 51.4523127,
        },
        zoom: 15,
        events: {
            click: (mapModel, eventName, originalEventArgs) => {

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
        console.log($scope.parkingArea);
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