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
    return P2000.find({}, {sort: {'attributes.publish_date' : -1}});
});

/**
 * @summary Creates a new mongo instance for CriticalEvents
 * @return The collection for CriticalEvents
 */
var criticalEvents = new Mongo.Collection('criticalEvents');
Meteor.publish('criticalEventsPub', function criticalEventsPub() {
    return criticalEvents.find({});
});

/**
 * @summary Creates a new mongo instance for SoundSensor
 * @return The collection for SoundSensor
 */
var SoundSensor = new Mongo.Collection('SoundSensor');
Meteor.publish('soundSensorPub', function soundSensorPub() {
    return SoundSensor.find({});
});


var collectionWrapper = {
	"WeatherStation" : WeatherStations,
    "P2000" : P2000,
    "criticalEvents" : criticalEvents,
    "SoundSensor" : SoundSensor
};
export {collectionWrapper};
