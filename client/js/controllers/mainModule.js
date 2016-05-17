import angular from 'angular';
import angularMeteor from 'angular-meteor';
import 'angular-simple-logger';
import 'angular-google-maps';
import 'angular-ui-bootstrap';

var MAIN_MODULE;
if(!MAIN_MODULE) {
    MAIN_MODULE = angular.module('dashboard', [
        angularMeteor,
        'nemLogging',
        'uiGmapgoogle-maps',
		'ui.bootstrap',
		'ui.router'
    ]).config(function($stateProvider, $urlRouterProvider){
			$urlRouterProvider.otherwise('/weather');
			$stateProvider.state('weather',
				{
					url:'/weather',
					templateUrl: 'client/js/directives/infoWeather.html'
				});
	});
}

export {MAIN_MODULE}