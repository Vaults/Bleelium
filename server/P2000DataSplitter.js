import {HTTP} from 'meteor/http';
import {postOrionData, deleteOrionData, deleteLocalData} from '/server/imports/orionAPI.js';
import {collectionWrapper} from '/server/imports/collections.js';
import {rewriteAttributes, handleError} from '/server/imports/util.js';

var splitData = function(o){

    var id = o.guid[0]._;
    var title =  o.title[0];
    var description = o.description[0].replace(/\<(.*?)\>/g, '').replace('(', '').replace(')', '');
    var date = o.pubDate[0];
    var coord_lat =  o['geo:lat'];
    var coord_lng = o['geo:long'];

    console.log(createP2000Data(id, title, description, date, coord_lat, coord_lng).contextElements[0].attributes);
    //return(createP2000Data());
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
                        "name": "title",
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
                    }
                ]
            }
        ],
        "updateAction": "APPEND"
    };
}

export {splitData, createP2000Data}