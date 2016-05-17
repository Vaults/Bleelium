import { HTTP } from 'meteor/http';
import { EJSON } from 'meteor/ejson';
import { Mongo } from 'meteor/mongo';

WeatherStations = new Mongo.Collection('weatherStations');
Meteor.publish('weatherPub', function weatherPublication(){
  return WeatherStations.find({});
})

var dataIDmap = {
	"2750953" : "Eindhoven",
	"2745706" : "Veldhoven",
	"2754447" : "Helmond"
}
var query = {data:{entities:[]}};
for(key in dataIDmap){
	query.data.entities.push({
        "type": "WeatherStation",
        "isPattern": "false",
        "id": key
    });
}


/* https://github.com/percolatestudio/meteor-synced-cron */
SyncedCron.add({
	name: 'Collect the OpenWeatherMap data and store it into orion',
	schedule: function(parser) {
		// parser is a later.parse object
		return parser.text('every 20 seconds');
	},
	job: function() {
		console.log("updated");
		var update = function(loc, id){
			HTTP.call( 'GET',  "http://api.openweathermap.org/data/2.5/weather?appid=ec57dc1b5b186be9c7900a63a3e34066&q="+ loc+ "&units=metric", {}, function( error, response ) {
				if ( error ) {
					console.log( error );
				} else {
	
					var weatherdata =  {
							"contextElements": [
								{
									"type": "WeatherStation",
									"isPattern": "false",
									"id": id,
									"attributes": [
										{
										"name": "name",
												"type": "string",
												"value": response.data.name
										},
										{
										"name": "location",
												"type": "string",
												"value": loc,
										},
										{
										"name": "coord_lon",
												"type": "float",
												"value": response.data.coord.lon
										},
										{
										"name": "coord_lat",
												"type": "float",
												"value": response.data.coord.lat
										},
										{
										"name": "weather_main",
												"type": "string",
												"value": response.data.weather[0].main
										},
										{
										"name": "weather_description",
												"type": "string",
												"value": response.data.weather[0].description
										},
										{
										"name": "weather_icon",
												"type": "string",
												"value": response.data.weather[0].icon
										},
										{
										"name": "temp",
												"type": "float",
												"value": response.data.main.temp
										},
										{
										"name": "pressure",
												"type": "float",
												"value": response.data.main.pressure
										},
										{
										"name": "humidity",
												"type": "float",
												"value": response.data.main.humidity
										},
										{
										"name": "temp_min",
												"type": "float",
												"value": response.data.main.temp_min
										},
										{
										"name": "temp_max",
												"type": "float",
												"value": response.data.main.temp_max
										},
										{
										"name": "wind_speed",
												"type": "float",
												"value": response.data.wind.speed
										},
										{
										"name": "wind_deg",
												"type": "float",
												"value": response.data.wind.deg
										},
										{
										"name": "country",
												"type": "string",
												"value": response.data.sys.country
										},
										{
										"name": "sunrise",
												"type": "int",
												"value": response.data.sys.sunrise
										},
										{
										"name": "sunset",
												"type": "int",
												"value": response.data.sys.sunset
										}
									]
								}
							],
							"updateAction": "APPEND"
					};
					
					/* proof that OpenWeatherMap is messing up 
					console.log(response.data);
					console.log('weatherdata:', loc, id, weatherdata.contextElements[0].attributes[0], weatherdata.contextElements[0].attributes[7], response.data.main.temp, response.data.name);
					*/
			
					HTTP.call( 'POST', 'http://131.155.70.152:1026/v1/updateContext', {data: weatherdata},	function( error2, response2 ) {
						if ( error2 ) {
							console.log( error2 );
						} 
					});
				}
			});
		}
		
		for(key in dataIDmap){
			update(dataIDmap[key], key);
		}  
  }
});



var pull = function(){
	
	HTTP.call( 'POST', 'http://131.155.70.152:1026/v1/queryContext', query, function( error, response ) {
		
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
			var rewriteAndInsertAttributes = function(obj){
				for(var i = 0; i < obj.data.contextResponses.length; i++){
						var tempobj = obj.data.contextResponses[i].contextElement;
						tempobj.attributes = attributesToKeyValue(tempobj.attributes);
						WeatherStations.insert(tempobj);
				}
			}
			rewriteAndInsertAttributes(response);
		}
	});
};
var reloadPull = function(){
	pull();
	Meteor.setTimeout(reloadPull, 5000);
}

if(!Meteor.isTest){
	SyncedCron.start();
	reloadPull();
}