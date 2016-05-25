import { Meteor } from 'meteor/meteor';
import { assert } from 'meteor/practicalmeteor:chai';
import { Mongo } from 'meteor/mongo';
import { collectionWrapper } from '/server/imports/collections.js';

//to be tested functions
import {ambulanceInfo} from '/server/P2000DataSplitter.js';


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
    it('should return first word of the description string ', function () {
        var test = 'hello I am a test'
        assert.equal("hello", ambulanceInfo(test).prio);
    });
});



