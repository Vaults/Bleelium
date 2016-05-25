import {HTTP} from 'meteor/http';
import {collectionWrapper} from '/server/imports/collections.js';
import {rewriteAttributes, handleError} from '/server/imports/util.js';

var postOrionData = function(data, callback){ //sends data to Orion
	HTTP.call('POST', 'http://131.155.70.152:1026/v1/updateContext', {data: data}, callback);		
}

var pull= function(coll, args, callback) { //grabs data from Orion
	var collection = collectionWrapper[coll];
	//console.log(query.data.entities[0]);
    HTTP.call('GET', 'http://131.155.70.152:1026/v1/contextEntityTypes/'+coll+args, handleError(function(response) {
		collection.remove({});
        rewriteAttributes(response, callback);
    }));
};

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