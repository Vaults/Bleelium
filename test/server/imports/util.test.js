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
describe('rewriteAttributes()', function(done) {
    var testResponse = function(){
        return {
            "data": {
                "contextResponses": [{
                    "contextElement": {
                        "type": "P2000",
                        "isPattern": "false",
                        "id": "1605251023480222",
                        "attributes": [
                            {
                                "name": "description",
                                "type": "string",
                                "value": "1123129 MKA Brabant Zuid-Oost  Ambulance 22-129 Helmond "
                            },
                            {
                                "name": "publish_date",
                                "type": "string",
                                "value": "Wed, 25 May 2016 10:23:48 +0200"
                            },
                            {
                                "name": "title",
                                "type": "string",
                                "value": "B1 5702PW 21 : Raafstraat Helmond Obj: Rit: 41005~"
                            }
                        ]
                    },
                    "statusCode": {
                        "code": "200",
                        "reasonPhrase": "OK"
                    }
                }]
            }
        };
    }
    it('Simple P2000 response without callback', function () {
        var res = rewriteAttributes(testResponse());
        var resObjAttr = testResponse().data.contextResponses[0].contextElement.attributes;
        var convObjAttr = res.data.contextResponses[0].contextElement.attributes;
        assert.equal(convObjAttr.description, resObjAttr[0].value);
        assert.equal(convObjAttr.publish_date, resObjAttr[1].value);
        assert.equal(convObjAttr.title, resObjAttr[2].value);
    });
    it('Simple P2000 response with callback', function(done){
        rewriteAttributes(testResponse, function(o){
            assert.equal(testResponse, o);
            done();
        })
    });
});
describe('handleError()', function () {
    //no tests yet
});
describe('numToObj()', function () {
    //no tests yet
});
describe('rewriteNumbersToObjects()', function () {
    //no tests yet
});
