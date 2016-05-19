import {HTTP} from 'meteor/http';
import {collectionWrapper} from '/server/imports/collections.js';

var postOrionData = function(data, callback){ //sends data to Orion
	HTTP.call('POST', 'http://131.155.70.152:1026/v1/updateContext', {data: data}, callback);		
}

var pull = function(coll, query) { //grabs data from Orion
	var collection = collectionWrapper[coll];
	//console.log(query.data.entities[0]);
    HTTP.call('POST', 'http://131.155.70.152:1026/v1/queryContext', query, function (error, response) {
        if (error) {
            console.log(error);
        } else {
			collection.remove({});
            var attributesToKeyValue = function (attr) {
                var temp = {}
                attr.forEach(function (o) {
                    temp[o.name] = o.value;
                });
                return temp;
            }
            var rewriteAndInsertAttributes = function (obj) {
                for (var i = 0; i < obj.data.contextResponses.length; i++) {
                    var tempobj = obj.data.contextResponses[i].contextElement;
                    tempobj.attributes = attributesToKeyValue(tempobj.attributes);
                    collection.insert(tempobj);
                }
            }
            rewriteAndInsertAttributes(response);
        }
    });
};

var reloadPull = function (collection, query) { //calls pull every 5 seconds until the program terminates
    pull(collection, query);
    Meteor.setTimeout(function(){reloadPull(collection, query)}, 5000);
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