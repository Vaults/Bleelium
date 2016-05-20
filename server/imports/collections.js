import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

var WeatherStations = new Mongo.Collection('weatherStations');
Meteor.publish('weatherPub', function weatherPublication() {
    return WeatherStations.find({});
});

var P2000 = new Mongo.Collection('P2000');
Meteor.publish('P2000Pub', function P2000Publication() {
    return P2000.find({});
});


var collectionWrapper = {
	"WeatherStations" : WeatherStations,
  "P2000" : P2000
};
export {collectionWrapper};
