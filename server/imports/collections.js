import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';

var secSelector = {'attributes.dt': {$gte: (new Date().getTime() - 2 * 24 * 60 * 60 * 1000) + ''}};

/**
 * @summary Creates a new mongo instance for WeatherStations
 * @return {json} - The collection for WeatherStations
 */
var WeatherStations = new Mongo.Collection('weatherStations');
Meteor.publish('weatherPub', function weatherPublication() {
    return WeatherStations.find({});
});

/**
 * @summary Creates a new mongo instance for P2000
 * @return {json} - The collection for P2000
 */
var P2000 = new Mongo.Collection('P2000');
Meteor.publish('P2000Pub', function P2000Publication() {
    return P2000.find(secSelector);
});

/**
 * @summary Creates a new mongo instance for CriticalEvents
 * @return {json} - The collection for CriticalEvents
 */
var criticalEvents = new Mongo.Collection('criticalEvents');
Meteor.publish('criticalEventsPub', function criticalEventsPub() {
    return criticalEvents.find({});
});

/**
 * @summary Creates a new mongo instance for SoundSensor
 * @return {json} - The collection for SoundSensor
 */
var SoundSensor = new Mongo.Collection('SoundSensor');
Meteor.publish('soundSensorPub', function soundSensorPub() {
    return SoundSensor.find(secSelector);
});

/**
 * @summary Creates a new mongo instance for ParkingArea
 * @return {json} - The collection for ParkingArea
 */
var ParkingArea = new Mongo.Collection('ParkingArea');
var ParkingLot = new Mongo.Collection('ParkingLot');
Meteor.publish('parkingAreaPub', function parkingAreaPub() {
    return ParkingArea.find({});
});
/**
 * @summary Creates a new mongo instance for AggregationCache
 * @return {json} - The collection for AggregationCache
 */
var AggregationCache = new Mongo.Collection('AggregationCache');
Meteor.publish('AggregationCachePub', function aggregationCachePub() {
    return AggregationCache.find({});
});

/**
 * @summary The array to map collections to variables
 * @var {array} - collectionWrapper
 */
var collectionWrapper = {
    "WeatherStation": WeatherStations,
    "P2000": P2000,
    "criticalEvents": criticalEvents,
    "aggregationCache": AggregationCache,
    "SoundSensor": SoundSensor,
    "ParkingArea": ParkingArea,
    "ParkingLot": ParkingLot
};

//exports for tests
export {collectionWrapper};
