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
});