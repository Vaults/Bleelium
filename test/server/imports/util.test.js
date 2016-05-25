import { Meteor } from 'meteor/meteor';
import { assert } from 'meteor/practicalmeteor:chai';
import { Mongo } from 'meteor/mongo';
import { collectionWrapper } from '/server/imports/collections.js';

//to be tested functions
import {attributesToKeyValue, rewriteAttributes, handleError} from '/server/imports/util.js';
describe('attributesToKeyValue()', function(){
	it('Simple Orion Object', function(){
        var orObj = [
            {
                "name": "a",
                "type": "string",
                "value": "b"
            },
            {
                "name": "illuminati",
                "type": "string",
                "value": "confirmed"
            }
        ];
        var converted = attributesToKeyValue(orObj);
        assert.equal(converted.a, 'b');
        assert.equal(converted.illuminati, 'confirmed');
        assert.equal(Object.keys(converted).length, 2);
    });
});
describe('rewriteAttributes()', function(){
	//no tests yet
});
describe('handleError()', function(){
	//no tests yet
});
describe('numToObj()', function(){
	//no tests yet
});
describe('rewriteNumbersToObjects()', function(){
	//no tests yet
});
