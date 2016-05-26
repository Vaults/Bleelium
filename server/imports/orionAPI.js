import {HTTP} from 'meteor/http';
import {rewriteAttributes, handleError} from '/server/imports/util.js';
import {ENDPOINT} from '/server/config.js';
/**
 *
 * @param data
 * @param callback
 */
var postOrionData = function(data, callback){ //sends data to Orion
	HTTP.call('POST', ENDPOINT+':1026/v1/updateContext', {data: data}, callback);
}
/**
 *
 * @param coll
 * @param args
 * @param callback
 */
var pull= function(coll, args, callback) { //grabs data from Orion
	//console.log(query.data.entities[0]);
    HTTP.call('GET', ENDPOINT+':1026/v1/contextEntityTypes/'+coll+args, handleError(function(response) {
        rewriteAttributes(response, callback);
    }));
};
/**
 * 
 * @param collection
 * @param args
 * @param callback
 */
var reloadPull = function (collection, args, callback) { //calls pull every 5 seconds until the program terminates
    pull(collection, args, callback); //http://131.155.70.152:1026/v1/contextEntityTypes/P2000?orderBy=!publish_date
    Meteor.setTimeout(function(){reloadPull(collection, args, callback)}, 5000);
}

/* var initQuery = function(typeName, map){ //creates a query in order to get data from Orion
	var query = {data: {entities: []}};
	for (key in map) {
		query.data.entities.push({
			"type": typeName,
			"isPattern": "false",
			"id": key
		});
	}
	return query;
} */
//exports for tests
export {postOrionData, pull, reloadPull}