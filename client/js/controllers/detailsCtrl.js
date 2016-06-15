import {MAIN_MODULE} from  './mainModule.js';

MAIN_MODULE.controller('detailsCtrl', function ($scope, $meteor, $reactive, $rootScope, $state, IconService, aggregateParking, circleHandler, ParkingService) {
    $meteor.subscribe('parkingAreaPub');

    //Load the name and coordinates for this location
    var arg = ParkingArea.findOne(ParkingService.parkingLocation);

    console.log(ParkingService.parkingLocation);
    console.log(arg.attributes);

    $scope.latitude = lodash.round(arg.attributes.coord_lat, 2);
    $scope.longtitude = lodash.round(arg.attributes.coord_lon, 2);
    $scope.address = arg.attributes.address; //parking address name
    circleHandler($scope, arg.attributes.index);
    $scope.parkingLot = arg.attributes.name;
    console.log(arg.parkingLots);
    $scope.parkingSpaces = arg.parkingLots[Object.keys(arg.parkingLots)[0]];
    ParkingService.parkingSpaces = arg.parkingLots[Object.keys(arg.parkingLots)[0]];
    ParkingService.parkingLocation = { //Set a global variable with current location
        'attributes.coord_lat': '' + lodash.round(arg.attributes.coord_lat, 2),
        'attributes.coord_lon': '' + lodash.round(arg.attributes.coord_lat, 2)
    };
    var imageElement = document.querySelector("parking-image");
    imageElement.setAttribute('template-url', $scope.parkingLot);
    ParkingService.setParkingImage();
    $scope.$apply();

}).directive('parkingImage', ['ParkingService', function(ParkingService){
    return {
        restrict: 'E',
        link: function(scope,element,attrs) {
            console.log(attrs.templateUrl);
            scope.contentUrl = 'img/parking/'+attrs.templateUrl+'.svg';
            scope.$watch(function() {return element.attr('template-url'); }, function(v){
                scope.contentUrl = 'img/parking/'+v+'.svg';
            });
        },
        template: '<div ng-include="contentUrl"></div>'
    }
}]);
