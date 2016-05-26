import {HTTP} from 'meteor/http';

var splitData = function(o){

    var id = o.guid[0]._;

    var description = o.description[0].replace(/\<(.*?)\>/g, '').replace('(', '').replace(')', '');
    var title = o.title[0].replace('(DIA: )','');
    var date = o.pubDate[0];
    var coord_lat =  o['geo:lat'];
    var coord_lng = o['geo:long'];
    return createP2000Data(id, title, description, date, coord_lat, coord_lng)
}

var parseData = function (title, desc, coord_lat){
   if( desc.indexOf("Ambulance") > -1){
       return(ambulanceInfo(title,coord_lat));
   }else if( desc.indexOf("Politie") > -1){
      // return(policeInfo(title));
   }else if( desc.indexOf("Brandweer") > -1){
       
   }
}

/**
 * @summary Determines the type of P2000 info and breaks it into usable chunks.
 * @param title
 * @returns {Object}
 */
var ambulanceInfo = function(title,coord_lat){
    var descr = "";

    for(var i = 3; i < title.split(" ").length ; i++){
        descr += (title.split(" ")[i] + ' ');
    }

    var titleArray = title.split(" ");
    var cleanSplit = lodash.remove(titleArray,function(o){
        return (o=='' || o==":");
    });

    var obj = {
        "prio" : titleArray[0],
        "postalCode" : titleArray[1],
        "number" : titleArray[2],
        "restTitle": descr,
        "geoLocation": ""
    }
    console.log(obj.postalCode);
    if(!coord_lat) {
        obj.geoLocation = newCoordinates(obj.postalCode);
    }
    return obj;
}

/**
 * Uses the muriloventuroso:get-coordinates package to call the Google Geolocation API, to get coordinates.
 * @param address
 * @returns {boolean|location|{longitude, latitude}|*|Location|String|DOMLocator}
 */
var newCoordinates = function(address) {
    var key = 'AIzaSyDrFcrpzXJxVQm1-uMU1ovfnAON_55EO3c';
    Coordinates.key = key;
    var loc = Coordinates.getFromAdress(address);
    console.log(loc);
    return loc.location;
}


var createP2000Data = function (id, title, description, date, coord_lat, coord_lng) { //Creates orion-compliant objects for Orion storage

    return {
        "contextElements": [
            {
                "type": "P2000",
                "isPattern": "false",
                "id": id,
                "attributes": [
                    {
                        "name": "EST",
                        "type": "string",
                        "value": title
                    },
                    {
                        "name": "description",
                        "type": "string",
                        "value": description
                    },
                    {
                        "name": "publish_date",
                        "type": "string",
                        "value": date
                    },
                    {
                        "name": "coord_lat",
                        "type": "string",
                        "value": coord_lat
                    },
                    {
                        "name": "coord_lng",
                        "type": "string",
                        "value": coord_lng
                    },
                    {
                        "name": "info",
                        "type": "string",
                        "value": parseData(title, description, coord_lat)
                    }
                ]
            }
        ],
        "updateAction": "APPEND"
    };
}

export {splitData, ambulanceInfo, createP2000Data}