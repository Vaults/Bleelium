import {MAIN_MODULE} from  './mainModule.js';
/**
 * @summary controller for the parking details page
 * @param $scope Angular scope
 * @param $meteor Angular meteor handle
 * @param $reactive Angular reactive component
 * @param $rootScope Angular root scope
 * @param IconService is used to set the marker icon
 * @param aggregateParking is used for the parking space aggregation to get the occupancy values
 * @param circleHandler is used to give correct scope values to the percentage circle
 * @param ParkingService is used to keep parking state
 */
MAIN_MODULE.controller('parkingDetailsCtrl', function ($scope, $meteor, $reactive, $rootScope, $state, IconService, aggregateParking, circleHandler, ParkingService) {

    $meteor.subscribe('parkingAreaPub');

    /**
     * @summary sets the free parking spaces to green based on parkingSpaces set in the ParkingService
     */
    var setParkingImage = function() {
        var parkingSpaces = ParkingService.parkingSpaces;
        //For each full parking space, set the svg's color to red, otherwise green

        for (var i = 0; i < parkingSpaces.length; i++) {

            var selector = "#ParkingSpace-" + (i + 1);
            var thisSpace = document.querySelector(selector);
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
    };
    $scope.color = ParkingService.color;
    //Change the loaded image to the correct one by altering the HTML attribute
    document.querySelector("parking-image").setAttribute('template-url', ParkingService.name);
    setTimeout(function(){setParkingImage();}, 150);
    circleHandler($scope, ParkingService.areaIndex);
});
/**
 * @summary Creates the HTML tag for the parking image and detects when it needs to be updated
 */
MAIN_MODULE.directive('parkingImage', ['ParkingService', function(ParkingService){
    return {
        restrict: 'E',
        link: function(scope,element,attrs) {
            scope.contentUrl = 'img/parking/'+attrs.templateUrl+'.svg';
            //When attribute changes, load corresponding image
            scope.$watch(function() {return element.attr('template-url'); }, function(v){
                scope.contentUrl = 'img/parking/'+v+'.svg';
            });
        },
        template: '<div ng-include="contentUrl" style="height:100%"></div>'
    }
}]);
