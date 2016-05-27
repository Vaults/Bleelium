import {HTTP} from 'meteor/http';

/**
 * @summary Makes a distinction between Ambulance, police or firefighter data.
 * @param o
 * @returns TODO
 */
var parseData = function (o){
   if( o.desc.indexOf("Ambulance") > -1){
       return(ambulanceInfo(o));
   }else if( o.desc.indexOf("Politie") > -1){
      // return(policeInfo(title));
   }else if(o.desc.indexOf("BRW") > -1){
       fireFighterInfo(o);
   }
}

/**
 * @summary Parses ambulance info from P2000
 * @param o
 * @modifies o
 * @returns {*}
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
 * @summary Parses police info from P2000
 * @param o
 * @modifies o
 * @returns {*}
 */
var policeInfo = function(o){
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
 * @summary Parses firefighter info from P2000
 * @param o
 * @modifies o
 * @returns {*}
 */
var fireFighterInfo = function(o){
    console.log(o);



    // { title: 'PRIO 1 : Aanrijding letsel (Soort voertuig: personenauto) Bakker en Kok t Heike 5 a Reu : 4071 4041 22604 OVD~',
    // link: [ 'http://monitor.livep2000.nl?SPI=1605261656450122' ],
    // description: [ '1107998 BRW Reusel ( <i name=w3878 class=wb>Monitorcode</i> )<br/>1107960 BRW Reusel ( Vrijwilligers Dagdienst )<br/>1107946 BRW Reusel ( Bezetting <i name=w3873 class=wb>TS</i> )<br/>1107933 BRW Reusel ( BLS <i name=w3863 class=wb>First Responders</i> )<br/>1107923 BRW Reusel ' +
    // '( Bemanning <i name=w3865 class=wb>HV</i> Ploeg B )<br/>1107920 BRW Reusel ( Bemanning <i name=w3865 class=wb>HV</i> Ploeg A )<br/>1104799 BRW Brabant-Zuidoost ( <i name=w3878 class=wb>Monitorcode</i> )<br/>1104764 BRW Brabant-Zuidoost ( <i name=w3853 class=wb>OvD</i> West )<br/>' ],
    // pubDate: [ 'Thu, 26 May 2016 16:56:45 +0200' ],
    // guid: [ { _: '1605261656450122', '$': [Object] } ],
    // desc: '1107998 BRW Reusel  Monitorcode 1107960 BRW Reusel ' +
    // '( Vrijwilligers Dagdienst )1107946 BRW Reusel ( Bezetting TS )1107933 BRW Reusel ' +
    // '( BLS First Responders )1107923 BRW Reusel ( Bemanning HV Ploeg B )1107920 BRW Reusel ( Bemanning HV Ploeg A )1104799 BRW Brabant-Zuidoost ( Monitorcode )1104764 BRW Brabant-Zuidoost ( OvD West )' }
    //
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
    //51.50N, 5.60E topright
    //51°23′N 5°20′E bottom left
    o.coord_lng = lodash.random(5.2, 5.60);
    o.coord_lat = lodash.random(51.23, 51.50);
}

/**
 * @summary Get and modifies all necessary P2000 data into 1 object.
 * @param o
 * @modifies o
 * @returns {{contextElements: *[], updateAction: string}}
 */
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
        "updateAction": "APPEND_STRICT"
    };
}

export {geoLoc,generateFakeCoords,policeInfo,ambulanceInfo, createP2000Data}