import { Meteor } from 'meteor/meteor';
import { assert } from 'meteor/practicalmeteor:chai';
import { Mongo } from 'meteor/mongo';
import { collectionWrapper } from '/server/imports/collections.js';

//to be tested functions
import {geoLoc,generateFakeCoords, policeInfo,ambulanceInfo, createP2000Data} from '/server/P2000DataSplitter.js';


describe('createP2000Data()', function(){
	//no tests yet
});
describe('pushP2000ToOrion()', function(){
	//no tests yet
});
describe('parseData()', function(){
    //no tests yet
});
describe('ambulanceInfo()', function(){
    it('should return object with correct ambulance info', function () {
        
    });
});
describe('policeInfo()', function(){
    it('should return object with correct police info', function () {
        
    });
});
describe('createP2000Data()', function(){
    it('should return object with P200 data format we specified', function () {
        
    });
});
describe('geoLoc()', function(){
    it('should return Coordinates between ', function () {
        
    });
});
describe('generateFakeCoords()', function(){
    it('should return first word of the description string ', function () {
        
    });
});



