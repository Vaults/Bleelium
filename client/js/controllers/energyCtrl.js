import {MAIN_MODULE} from  './mainModule.js';

MAIN_MODULE.controller('energyCtrl', function ($scope) {
    $scope.map = {
        center: {
            longitude: 5.48,
            latitude: 51.44
        },
        zoom: 13,
        options: {
            disableDefaultUI: true
        }
    }
});
