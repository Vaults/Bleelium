import {HTTP} from 'meteor/http';
import {collectionWrapper} from '/server/imports/collections.js';
import {rewriteAndInsertAttributes} from '/server/imports/util.js';

var postOrionData = function(data, callback){ //sends data to Orion
	HTTP.call('POST', 'http://131.155.70.152:1026/v1/updateContext', {data: data}, callback);		
}

var pull = function(coll, query, callback) { //grabs data from Orion
	var collection = collectionWrapper[coll];
	//console.log(query.data.entities[0]);
    HTTP.call('POST', 'http://131.155.70.152:1026/v1/queryContext', query, function (error, response) {
        if (error) {
            console.log(error);
        } else {
			collection.remove({});
            rewriteAndInsertAttributes(response, callback);
        }
    });
};

var reloadPull = function (collection, query, callback) { //calls pull every 5 seconds until the program terminates
    pull(collection, query, callback);
    Meteor.setTimeout(function(){reloadPull(collection, query, callback)}, 5000);
}

var initQuery = function(typeName, map){ //creates a query in order to get data from Orion
	var query = {data: {entities: []}};
	for (key in map) {
		query.data.entities.push({
			"type": typeName,
			"isPattern": "false",
			"id": key
		});
	}
	return query;
}
//exports for tests
export {postOrionData, pull, reloadPull, initQuery}