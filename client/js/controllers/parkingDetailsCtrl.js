import {MAIN_MODULE} from  './mainModule.js';

MAIN_MODULE.controller('parkingDetailsCtrl', function ($scope, $meteor, $reactive, $rootScope, $state, IconService, aggregateParking, circleHandler, ParkingService) {

    $meteor.subscribe('parkingAreaPub');

    var setParkingImage = function() {
        var parkingSpaces = ParkingService.parkingSpaces;
        //For each full parking space, set the svg's color to red, otherwise green
        //console.log(parkingSpaces);
        for (var i = 0; i < parkingSpaces.length; i++) {
            console.log(parkingSpaces[i])

            var selector = "#ParkingSpace-" + (i + 1);
            var thisSpace = document.querySelector(selector);
            console.log(thisSpace);
            if (!thisSpace) {
                continue;
            }
            if (parkingSpaces[i].attributes.occupied === "true") {
                thisSpace.style.fill = "#ea5959";
            }
            else {
                thisSpace.style.fill = "#53dc4e";
            }
        }
    }

    //Load the name and coordinates for this location
    //var arg = ParkingArea.findOne(ParkingService.parkingLocation);

    //$scope.latitude = lodash.round(arg.attributes.coord_lat, 2);
   // $scope.longtitude = lodash.round(arg.attributes.coord_lon, 2);
    //$scope.address = arg.attributes.address; //parking address name
    //circleHandler($scope, arg.attributes.index);


    var imageElement = document.querySelector("parking-image");
    imageElement.setAttribute('template-url', ParkingService.name);
    setTimeout(function(){
        setParkingImage();
    }, 500);
    circleHandler($scope, ParkingService.areaIndex);

}).directive('parkingImage', ['ParkingService', function(ParkingService){
    return {
        restrict: 'E',
        link: function(scope,element,attrs) {
            //console.log(attrs.templateUrl);
            scope.contentUrl = 'img/parking/'+attrs.templateUrl+'.svg';
            scope.$watch(function() {return element.attr('template-url'); }, function(v){
                scope.contentUrl = 'img/parking/'+v+'.svg';
            });
        },
        template: '<div ng-include="contentUrl"></div>'
    }
}]);
