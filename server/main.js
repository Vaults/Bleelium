import { HTTP } from 'meteor/http';
import { EJSON } from 'meteor/ejson';
import { Mongo } from 'meteor/mongo';

WeatherStations = new Mongo.Collection('weatherStations');

Meteor.publish('weatherPub', function weatherPublication(){
  return WeatherStations.find({});
});

var pull = function(){
	
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
			WeatherStations.remove({});
			var attributesToKeyValue= function(attr){
				var temp = {}
				attr.forEach(function(o){
					temp[o.name] = o.value;
				});
				return temp;
			}
			var rewriteAttributes = function(obj){
				obj.data.contextResponses[0].contextElement.attributes = attributesToKeyValue(	obj.data.contextResponses[0].contextElement.attributes);
			  return obj;
			}
			json = rewriteAttributes(response);
			WeatherStations.insert(json.data.contextResponses[0].contextElement);
			console.log('pulled from Orion');
		}
	});
};
var reloadPull = function(){
	pull();
	Meteor.setTimeout(reloadPull, 5000);
}

reloadPull();
