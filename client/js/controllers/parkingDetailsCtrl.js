import {MAIN_MODULE} from  './mainModule.js';

MAIN_MODULE.controller('parkingDetailsCtrl', function ($scope, $meteor, $reactive, $rootScope, $state, IconService, aggregateParking, circleHandler, ParkingService) {

    $meteor.subscribe('parkingAreaPub');

    /**
     * @summary sets the free parking spaces to green based on parkingSpaces set in the factory
     */
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
    };
    //Change the loaded image to the correct one by altering the HTML attribute
    var imageElement = document.querySelector("parking-image");
    imageElement.setAttribute('template-url', ParkingService.name);
    setTimeout(function(){
        setParkingImage();
    }, 500);
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
        template: '<div ng-include="contentUrl"></div>'
    }
}]);
