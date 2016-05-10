import angular from 'angular';
import angularMeteor from 'angular-meteor';

angular.module('dashboard', [
    angularMeteor
])
    .directive('navBar', function(){
        return {
            templateUrl: 'client/nav-bar.html',
            scope: {
                categories: '=',
            }
        };
    })
    .controller('dashboardCtrl', function($scope){

    $scope.categories = [
        {name:'MOBILITY', color: '#ea5959'},
        {name:'WEATHER', color: '#eb9860'},
        {name:'SECURITY', color: '#52acdb'},
        {name:'COMFORT', color: '#70cf7d'},
        {name:'ENERGY', color: '#f3db36'},
    ]
})