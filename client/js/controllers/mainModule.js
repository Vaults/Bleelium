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
			document.title = 'Smart-S';
			$urlRouterProvider.otherwise('/weather');
			
			$stateProvider.state('weather',	{
					templateUrl: 'client/ui-view.html',
					controller: 'weatherCtrl'
				})
				.state('weather.sub',	{
					url:'/weather',
					templateUrl: 'client/js/directives/infoWeather.html'
				})
				.state('parking',	{
					templateUrl: 'client/ui-view.html',
					controller: 'parkingCtrl'
				})
				.state('parking.sub',	{
					url:'/parking',
					templateUrl: 'client/js/directives/infoParking.html'
				});
	}).directive('navBar', function () {
			return {
				templateUrl: 'client/js/directives/nav-bar.html',
				scope: '=',
			};
		}).controller('navBarCtrl', function ($scope, $location) {
			$scope.navClass = function (path) {
				return (($location.path().substr(1, path.length) === path) ? 'active' : '');
			};
			$scope.categories = [
				{link: "parking", text: 'PARKING', color: '#ea5959'},
				{link: 'weather', text: 'WEATHER', color: '#eb9860'},
				{link: 'security', text: 'SECURITY', color: '#52acdb'},
				{link: 'energy', text: 'ENERGY', color: '#f3db36'},
			];
		}).directive('googleMap', function() {
			return {
				templateUrl: 'client/js/directives/google-map.html',
				scope: '='
			}
		});	
}

export {MAIN_MODULE}