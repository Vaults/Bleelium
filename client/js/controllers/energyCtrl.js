import {MAIN_MODULE} from  './mainModule.js';

MAIN_MODULE.controller('energyCtrl', function ($scope, util) {
    $scope.map = util.map;
});
