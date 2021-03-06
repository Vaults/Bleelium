import {
    createBoilerplateOrionObject,
    orionBoilerplateAttributePusher
} from '/server/imports/util.js';
/**
 * @summary Makes a distinction between Ambulance, police or firefighter data and calls the correct data handler.
 * @param {json} o - a P2000 entry
 * @returns {json} - Object with parsed data.
 */
var parseData = function (o) {
    if (o.description.indexOf("Ambulance") > -1 || o.description.indexOf("MKA") > -1) {
        o.type = 'Ambulance';
        return (ambulanceInfo(o));
    } else if (o.description.indexOf("Politie") > -1) {
        o.type = 'Politie';
        return (o);
    } else if (o.description.indexOf("Brandweer") > -1) {
        o.type = 'brandweer';
        return (o);
    } else {
        return false;
    }
}

/**
 * @summary Parses ambulance info from P2000 into a usable format.
 * @param {json} o - P2000 information object
 * @modifies {json} o
 * @returns {json} o - Parsed ambulance object
 */
var ambulanceInfo = function (o) {
    var description = "";

    for (var i = 3; i < o.title.split(" ").length; i++) {
        description += (o.title.split(" ")[i] + ' ');
    }
    var titleArray = o.title.split(" ");
    lodash.remove(titleArray, function (obj) {
        return (obj == '' || obj == ":");
    });
    o.prio = titleArray[0];
    o.strLoc = o.title.substring(
        o.title.indexOf(':') + 2,
        o.title.indexOf('Obj:')
    );
    o.restTitle = description;

    return o;
};

/**
 * @summary Get and modifies all necessary P2000 data into 1 object for orion
 * @param {json} o - All the P2000 data that is collected
 * @modifies {json} o
 * @returns {json} Object - The rewritten data
 */
var createP2000Data = function (o) { //Creates orion-compliant objects for Orion storage
    o.description = o.description[0].replace(/\<(.*?)\>/g, '').replace('(', '').replace(')', '').replace('<br/>', '');
    o.title = o.title[0].replace('(DIA: )', '');
    o.coord_lat = o['geo:lat'];
    o.coord_lng = o['geo:long'];
    delete o['geo:lat'];
    delete o['geo:long'];
    parseData(o); //modifies o
    var orionBoilerplate = createBoilerplateOrionObject("P2000", o.guid[0]._, "APPEND_STRICT");
    var attrMap = {
        type: '',
        EST: o.title,
        description: '',
        dt: new Date('' + o.pubDate[0]).getTime() + '',
        publish_date: o.pubDate[0] + '',
        coord_lat: '',
        coord_lng: '',
        prio: '',
        restTitle: '',
        strLoc: ''
    };
    return orionBoilerplateAttributePusher(orionBoilerplate, o, attrMap);

}

//exports for tests
export {parseData, ambulanceInfo, createP2000Data}
