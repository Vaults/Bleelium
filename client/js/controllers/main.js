import {MAIN_MODULE} from  './mainModule.js';

MAIN_MODULE.directive('navBar', function () {
        return {
            templateUrl: 'client/js/directives/nav-bar.html',
            scope: '=',
        };
    }).controller('navBarCtrl', function ($scope, $location) {
        $scope.navClass = function (path) {
            return (($location.path().substr(1, path.length) === path) ? 'active' : '');
        };
        $scope.categories = [
            {link: "mobility", text: 'MOBILITY', color: '#ea5959'},
            {link: 'weather', text: 'WEATHER', color: '#eb9860'},
            {link: 'security', text: 'SECURITY', color: '#52acdb'},
            {link: 'comfort', text: 'COMFORT', color: '#70cf7d'},
            {link: 'energy', text: 'ENERGY', color: '#f3db36'},
        ];
<<<<<<< HEAD
    });

=======
    }).directive('googleMap', function() {
    return {
        templateUrl: 'client/js/directives/google-map.html',
        scope: '='
    }
}).controller('googleMapCtrl', function($scope) {
    $scope.map = {
        center: {
            longitude: 5.4,
            latitude: 51.4
        },
        zoom: 11,
        events: {},
        options: {
            disableDefaultUI: true
        }
    };
});
>>>>>>> Test_Branch
