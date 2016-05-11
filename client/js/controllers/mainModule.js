import angular from 'angular';
import angularMeteor from 'angular-meteor';

var MAIN_MODULE;
if(!MAIN_MODULE) {
    MAIN_MODULE = angular.module('dashboard', [
        angularMeteor
    ]);
}

export {MAIN_MODULE}