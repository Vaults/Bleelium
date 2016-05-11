import { HTTP } from 'meteor/http';
import { EJSON } from 'meteor/ejson';
import { Mongo } from 'meteor/mongo';

WeatherStations = new Mongo.Collection('weatherStations');

HTTP.call( 'POST', 'http://131.155.70.152:1026/v1/queryContext', {
    data: {
        "entities": [
            {
                "type": "WeatherStation",
                "isPattern": "false",
                "id": "2750953"
            }
        ]
    }
}, function( error, response ) {
    if ( error ) {
        console.log( error );
    } else {
        WeatherStations.insert(response);
    }
});