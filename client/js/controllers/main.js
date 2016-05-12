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
        events: {
            click: (mapModel, eventName, originalEventArgs) => {
                $scope.marker.setLocation(originalEventArgs[0].latLng.lat(), originalEventArgs[0].latLng.lng());
                $scope.$apply();
            }
        },
        options: {
            disableDefaultUI: true
        }

    };

    $scope.marker = {
        options: {
            draggable: true
        },
        events: {
            dragend: (marker, eventName, args) => {
                this.setLocation(marker.getPosition().lat(), marker.getPosition().lng());
                $scope.$apply();
            }
        },
        location: {
            longitude: 5.4,
            latitude: 51.4
        },
    };
    
    $scope.setLocation = function (latitude, longitude) {
        return {
            latitude,
            longitude
        };

    };
});

// .config(['uiGmapGoogleMapApiProvider', function (GoogleMapApi) {
//     GoogleMapApi.configure({
//         client : 'Smart-S GMaps Key',
//         v: '3.17',
//         libraries: 'weather,geometry,visualization',
//         key: 'AIzaSyDrDOuv952_6s8fSldXtgoJsCMyEo6LXEE'
//     });
// }]);

