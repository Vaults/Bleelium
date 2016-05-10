import angular from 'angular';
import angularMeteor from 'angular-meteor';

angular.module('dashboard', [
    angularMeteor
])
.directive('navBar', function(){
        return {
            templateUrl: 'client/nav-bar.html',
        };
    })
.controller('navBarCtrl', function($scope){
    $scope.categories = [
        {link: 'mobility', text:'MOBILITY', color: '#ea5959'},
        {link: 'weather', text:'WEATHER', color: '#eb9860'},
        {link: 'security', text:'SECURITY', color: '#52acdb'},
        {link: 'comfort', text:'COMFORT', color: '#70cf7d'},
        {link: 'energy', text:'ENERGY', color: '#f3db36'},
    ]
    $scope.navClass = function(page) {
        var currentRoute = $location.path().substring(1) || 'weather';
        if (page === currentRoute){ return 'active'}
        return '';
        //return page === currentRoute ? 'active' : '';
    };
});