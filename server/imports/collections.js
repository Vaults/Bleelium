import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

var WeatherStations = new Mongo.Collection('weatherStations');
Meteor.publish('weatherPub', function weatherPublication() {
    return WeatherStations.find({});
});

var collectionWrapper = {
	"WeatherStations" : WeatherStations
};
export {collectionWrapper};
