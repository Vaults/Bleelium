/**
 * @summary Makes a distinction between Ambulance, police or firefighter data and calls the correct data handler.
 * @param {json} o - a P2000 entry
 * @returns {json} - Object with parsed data.
 */
var parseData = function (o){
   if( o.description.indexOf("Ambulance") > -1){
       o.type = 'Ambulance';
       return(ambulanceInfo(o));
   }else if( o.description.indexOf("Politie") > -1){
       o.type = 'Politie';
       return(o);
   }else if(o.description.indexOf("Brandweer") > -1){
      o.type = 'brandweer';
      return(o);
   }else{
       return false;
   }
}

/**
 * @summary Parses ambulance info from P2000 into a usable format.
 * @param {json} o - P2000 information object
 * @modifies {json} o
 * @returns {json} o - Parsed ambulance object
 */
var ambulanceInfo = function(o){
    var description = "";

    for(var i = 3; i < o.title.split(" ").length ; i++){
        description += (o.title.split(" ")[i] + ' ');
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
    o.restTitle = description;

    return o;
}

/**
 * @summary !!DEPRECATED!! Modifies object to include (fake) location data, and sets fakeFlag accordingly .
 * @param !!DEPRECATED!! {json} o
 * @pre  !!DEPRECATED!! {string} !o.coord_lat
 * @modifies !!DEPRECATED!!  {json} o
 * @deprecated
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
 * @summary !!DEPRECATED!! Generates fake coords for p2000 obbject o.
 * @param  !!DEPRECATED!! {json} o
 * @modifies !!DEPRECATED!! {json} o
 * @deprecated
 */
var generateFakeCoords = function(o){
    //51.50N, 5.60E topright
    //51°23′N 5°20′E bottom left
    o.coord_lng = lodash.random(5.2, 5.60);
    o.coord_lat = lodash.random(51.23, 51.50);
}

/**
 * @summary Get and modifies all necessary P2000 data into 1 object for orion
 * @param {json} o - All the P2000 data that is collected
 * @modifies {json} o
 * @returns {json} Object - The rewritten data
 */
var createP2000Data = function (o) { //Creates orion-compliant objects for Orion storage
    o.description =  o.description[0].replace(/\<(.*?)\>/g, '').replace('(', '').replace(')', '').replace('<br/>','');
    o.title = o.title[0].replace('(DIA: )','');
    o.coord_lat = o['geo:lat'];
    o.coord_lng = o['geo:long'];
    delete o['geo:lat'];
    delete o['geo:long'];
    parseData(o); //modifies o
    return {
        "contextElements": [
            {
                "type": "P2000",
                "isPattern": "false",
                "id": o.guid[0]._,
                "attributes": [
                    {
                        "name": "type",
                        "type": "string",
                        "value": o.type
                    },
                    {
                        "name": "EST",
                        "type": "string",
                        "value": o.title
                    },
                    {
                        "name": "description",
                        "type": "string",
                        "value": o.description
                    },
                    {
                        "name": "dt", //unix timestamp
                        "type": "string",
                        "value": new Date('' +o.pubDate[0]).getTime() + ''
                    },
                    {
                        "name": "publish_date",
                        "type": "string",
                        "value": o.pubDate[0] + ''
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
                ]
            }
        ],
        "updateAction": "APPEND_STRICT"
    };
}

//exports for tests
export {parseData,geoLoc,generateFakeCoords,ambulanceInfo, createP2000Data}
