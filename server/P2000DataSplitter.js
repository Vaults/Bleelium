import {HTTP} from 'meteor/http';

var splitData = function(o){

    var id = o.guid[0]._;

    var description = parseData(o.title[0].replace('(DIA: )',''), o.description[0].replace(/\<(.*?)\>/g, '').replace('(', '').replace(')', '') );

    var date = o.pubDate[0];
    var coord_lat =  o['geo:lat'];
    var coord_lng = o['geo:long'];


    //console.log(createP2000Data(id, title, description, date, coord_lat, coord_lng).contextElements[0].attributes[1]);
    //return(createP2000Data());
}

var parseData = function (title, desc){

   if( desc.indexOf("Ambulance") > -1){
       return(ambulanceInfo(title));
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
var ambulanceInfo = function(title){
    var descr = "";

    for(var i = 3; i < title.split(" ").length ; i++){
        descr += (title.split(" ")[i] + ' ');
    }

    var obj = {
        "prio" : title.split(" ")[0],
        "postalCode" : title.split(" ")[1],
        "number" : title.split(" ")[2],
        "restTitle": descr
    }

    //console.log(newCoordinates('5612jd'));

    return obj;
}

var newCoordinates = function(address) {

    var key = 'AIzaSyCGJXs-HRy1601h3vQkFldJI4Suf-6_LjU';
    var url = 'https://maps.googleapis.com/maps/api/geocode/json?address=';

        var apiUrl = url + address + '&key=' + key;
        console.log(apiUrl);
    
        var res = HTTP.get(apiUrl).data;
        if(res['status']=='OK'){
            var response = {
                'status': res['status'],
                'location': res['results'][0]['geometry']['location']
            };
        }else{
            var response = {'status': res['status']};
        }
        return response
}

// var policeInfo = function(title){
//     // var descr = "";
//     //
//     // for(var i = 3; i < title.split(" ").length ; i++){
//     //     descr += (title.split(" ")[i] + ' ');
//     // }
//     // console.log(descr);
//
//     var obj = {
//         "prio" : title.split(" ")[0],
//         "postalCode" : title.split(" ")[1],
//         "number" : title.split(" ")[2],
//         "restTitle": descr
//     }
//
//     console.log(obj);
//     return 'a';
// }

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
                    }
                ]
            }
        ],
        "updateAction": "APPEND"
    };
}

export {splitData, ambulanceInfo, createP2000Data}