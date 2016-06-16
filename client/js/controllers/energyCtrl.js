import {MAIN_MODULE} from  './mainModule.js';

/**
 * @summary controller for the energy tab
 * @param Angular scope
 * @param util utilities for map
 */
MAIN_MODULE.controller('energyCtrl', function ($scope, util) {
    $scope.map = util.map();
});
