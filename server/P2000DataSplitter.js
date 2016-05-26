import {HTTP} from 'meteor/http';


var parseData = function (o){
   if( o.desc.indexOf("Ambulance") > -1){
       return(ambulanceInfo(o));
   }else if( o.desc.indexOf("Politie") > -1){
      // return(policeInfo(title));
   }else if(o. desc.indexOf("Brandweer") > -1){

   }
}

/**
 * @summary Determines the type of P2000 info and breaks it into usable chunks.
 * @param title
 * @returns {Object}
 * @modifies o
 */
var ambulanceInfo = function(o){
    var descr = "";

    for(var i = 3; i < o.title.split(" ").length ; i++){
        descr += (o.title.split(" ")[i] + ' ');
    }
    var titleArray = o.title.split(" ");
    lodash.remove(titleArray,function(obj){
        return (obj=='' || obj==":");
    });
    o.prio = titleArray[0];
    o.strLoc = o.title.substring(
        o.title.indexOf(':') + 2,
        o.title.indexOf('Obj:')
    );
    o.restTitle = descr;

    return o;
}

/**
 * @summary Modifies object to include (fake) location data
 * @param obj
 * @pre !obj.coord_lat
 * @modifies o
 */
var geoLoc = function(o){
    if(!o.coord_lat){
        if(o['geo:lat']){
            o.coord_lat = o['geo:lat'];
            o.coord_lng = o['geo:long']
            o.fakeFlag = false;
            return;
        }else if(o.fakeFlag === undefined){
            o.fakeFlag = true;
            generateFakeCoords(o);
        }else{
            //retrieve actual coords
            //set fakeFlag to false
        }
    }else if(o.fakeFlag === undefined){
        o.fakeFlag = false;
    }
}
/**
 * @summary Generates fake coords for p2000 obj
 * @param o
 * @modifies o
 */
var generateFakeCoords = function(o){
    //51.31N, 5.31E topright
    //51°23′N 5°20′E bottom left
    o.coord_lng = lodash.random(5.2, 5.31);
    o.coord_lat = lodash.random(51.23, 51.31);
}

/**
 * @summary Uses the muriloventuroso:get-coordinates package to call the Google Geolocation API, to get coordinates.
 * @param address
 * @returns {boolean|location|{longitude, latitude}|*|Location|String|DOMLocator}
 */
/*var newCoordinates = function(address) {
    var key = 'AIzaSyDrFcrpzXJxVQm1-uMU1ovfnAON_55EO3c';
    Coordinates.key = key;
    var loc = Coordinates.getFromAdress(address);
    console.log(loc);
    return loc.location;
}*/


var createP2000Data = function (o) { //Creates orion-compliant objects for Orion storage
    o.desc =  o.description[0].replace(/\<(.*?)\>/g, '').replace('(', '').replace(')', '');
    o.title = o.title[0].replace('(DIA: )','');
    parseData(o); //modifies o
    geoLoc(o); //modifies o
    return {
        "contextElements": [
            {
                "type": "P2000",
                "isPattern": "false",
                "id": o.guid[0]._,
                "attributes": [
                    {
                        "name": "EST",
                        "type": "string",
                        "value": o.title
                    },
                    {
                        "name": "description",
                        "type": "string",
                        "value": o.desc
                    },
                    {
                        "name": "publish_date",
                        "type": "string",
                        "value": o.pubDate[0]
                    },
                    {
                        "name": "coord_lat",
                        "type": "string",
                        "value": o.coord_lat
                    },
                    {
                        "name": "coord_lng",
                        "type": "string",
                        "value": o.coord_lng
                    },
                    {
                        "name": "prio",
                        "type": "string",
                        "value": o.prio
                    },
                    {
                        "name": "restTitle",
                        "type": "string",
                        "value": o.restTitle
                    },
                    {
                        "name": "strLoc",
                        "type": "string",
                        "value": o.strLoc
                    },
                    {
                        "name": "info",
                        "type": "string",
                        "value": o.fakeFlag
                    }
                ]
            }
        ],
        "updateAction": "APPEND"
    };
}

export {ambulanceInfo, createP2000Data}