import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';

/**
 * @summary Creates a new mongo instance for WeatherStations
 * @return The collection for WeatherStations
 */
var WeatherStations = new Mongo.Collection('weatherStations');
Meteor.publish('weatherPub', function weatherPublication() {
    return WeatherStations.find({});
});

/**
 * @summary Creates a new mongo instance for P2000
 * @return The collection for P2000
 */
var P2000 = new Mongo.Collection('P2000');
Meteor.publish('P2000Pub', function P2000Publication() {
    return P2000.find({}, {limit: 25});
});

var collectionWrapper = {
	"WeatherStation" : WeatherStations,
    "P2000" : P2000
};
export {collectionWrapper};
