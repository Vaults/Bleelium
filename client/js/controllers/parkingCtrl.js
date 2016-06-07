import {MAIN_MODULE} from  './mainModule.js';

/**
 * @summary Controller for the parking tab
 */
MAIN_MODULE.controller('parkingCtrl', function ($scope, $meteor, $reactive) {
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

    $scope.colors = {
        center    : 'lightBlue', // the color in the center of the circle. Default: #F5FBFC
        highlight : 'black', // the highlighted section of the circle, representing the percentage number. Default: #2BCBED
        remaining : 'lightGrey' // the color of the circle before highlighting occurs, representing the amount left until the percent equals 100. Default: #C8E0E8
    }
});