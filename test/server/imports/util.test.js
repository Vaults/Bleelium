import { assert } from 'meteor/practicalmeteor:chai';
import { expect } from 'meteor/practicalmeteor:chai';

//to be tested functions
import {attributesToKeyValue, rewriteAttributes, handleError, numToObj, rewriteNumbersToObjects, isEqual,createBoilerplateOrionObject,createBoilerplateOrionAttribute,orionBoilerplateAttributePusher} from '/server/imports/util.js';
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
        assert.equal(Object.keys(convObjAttr).length, 3);
    });
    it('Simple P2000 response with callback', function(done){
        rewriteAttributes(testResponse, function(o){
            assert.equal(testResponse, o);
            done();
        })
    });
});
describe('handleError()', function (done) {
    it('Orion bug, no error', function(){
        var simpleOrionBug = {statusCode: 200};
        handleError(function(o){return;})(simpleOrionBug, {bogus: 'element'});

    });
    it('Throws error successfully', function(){
        expect(function(){
            handleError(function(){})(new Error(), {bogus: 'element'});
        }).to.throw();
    });
    it('Normal behavior, no error', function(done){
        var res = handleError(function(o){assert.equal(o.bogus, 'element'); done();})(null, {bogus: 'element'});
    });
});
describe('numToObj()', function () {
    var orObj = function(){
        return {
            '1-deg': '62',
            '1-humidity': '82',
            '1-icon': '01d',
            '1-max': '21.44',
            '1-min': '12.86',
            '1-pressure': '1022.09',
            '1-timestamp': '1464260400',
            '2-deg': '55',
            '2-humidity': '69',
            '2-icon': '10d',
            '2-max': '20.97',
            '2-min': '15.01',
            '2-pressure': '1022.41',
            '2-timestamp': '1464346800',
            '3-deg': '122',
            '3-humidity': '85',
            '3-icon': '10d',
            '3-max': '24.46',
            '3-min': '16.08',
            '3-pressure': '1018.49',
            '3-timestamp': '1464433200',
            '4-deg': '35',
            '4-humidity': '0',
            '4-icon': '10d',
            '4-max': '23.37',
            '4-min': '16.77',
            '4-pressure': '1011.62',
            '4-timestamp': '1464519600',
            '5-deg': '228',
            '5-humidity': '0',
            '5-icon': '10d',
            '5-max': '17.02',
            '5-min': '12.8',
            '5-pressure': '1006.58',
            '5-timestamp': '1464606000',
            '6-deg': '229',
            '6-humidity': '0',
            '6-icon': '10d',
            '6-max': '18.87',
            '6-min': '12.93',
            '6-pressure': '1014.32',
            '6-timestamp': '1464692400',
            coord_lat: '51.45',
            coord_lon: '5.47',
            country: 'NL',
        }
    }
    it('Simple key-attr object', function(){
        var converted = numToObj(orObj());
        assert.equal(converted.forecast.day1['deg'], orObj()['1-deg']);
        assert.equal(converted.forecast.day6['icon'], orObj()['6-icon']);
        assert.isUndefined(converted.forecast.day7);
        assert.equal(Object.keys(converted).length, 4);
        assert.equal(Object.keys(converted.forecast.day1).length, 7);
    });
});
describe('rewriteNumbersToObjects()', function () {
    var testInput = function(){
        return rewriteAttributes({
            "data": {
                "contextResponses": [{
                    "contextElement": {
                        "type": "WeatherStation",
                        "isPattern": "false",
                        "id": "XXX",
                        "attributes": [
                            {
                                "name": "1-day",
                                "type": "string",
                                "value": "Monday"
                            },
                            {
                                "name": "2-day",
                                "type": "string",
                                "value": "Wednesday"
                            },
                            {
                                "name": "glob_var",
                                "type": "string",
                                "value": "xx"
                            }
                        ]
                    },
                    "statusCode": {
                        "code": "200",
                        "reasonPhrase": "OK"
                    }
                }]
            }
        });
    }

    it('Simple working weatherStations response', function () {
        var res = rewriteNumbersToObjects(testInput());
        var resObjAttr = testInput().data.contextResponses[0].contextElement.attributes;
        var convObjAttr = res.data.contextResponses[0].contextElement.attributes;
        assert.equal(convObjAttr.forecast.day1.day, resObjAttr['1-day']);
        assert.equal(convObjAttr.forecast.day2.day, resObjAttr['2-day']);
        assert.equal(convObjAttr.glob_var, resObjAttr.glob_var);
        assert.equal(Object.keys(convObjAttr).length, 2);
        assert.equal(Object.keys(convObjAttr.forecast).length, 2);
    });
});
describe('isEqual', function(){
    it('simple obj', function(){
        assert.isTrue(isEqual({"a":"B"}, {"a":"B"}));
    });
    it('simple nested obj', function(){
        assert.isTrue(isEqual({"a":"B", "b":{"x":"y"}}, {"a":"B", "b":{"x":"y"}}));
    });
    it('simple switched obj', function(){
        assert.isTrue(isEqual({"b":{"x":"y"}, "a":"B"}, {"a":"B", "b":{"x":"y"}}));
    });
    it('simple faulty nested obj', function(){
        assert.isFalse(isEqual({"a":"B", "b":{"A":"y"}}, {"a":"B", "b":{"x":"y"}}));
    });
    it('more nested obj', function(){
        assert.isTrue(isEqual({"a":"B", "b":{"x":"y", "a":{"a":3, "B":{x:123808123}}}}, {"a":"B", "b":{"x":"y", "a":{"a":3, "B":{x:123808123}}}}));
    });
    it('simple nested obj with arrays', function(){
        assert.isTrue(isEqual({"a":"B", "b":['a', 'b']}, {"a":"B", "b":['a', 'b']}));
    });
    it('simple nested faulty obj with arrays', function(){
        assert.isFalse(isEqual({"a":"B", "b":['a', 'b']}, {"a":"B", "b":['a', 'b', undefined, 3]}));
    });
    it('simple nested obj with arrays, different order', function(){
        assert.isTrue(isEqual({"b":['a', 'b'], "a":"B"}, {"a":"B", "b":['a', 'b']}));
    });
});
describe('createBoilerplateOrionObject', function(){
    var testBoilerplate = createBoilerplateOrionObject("Test","Test","APPEND");
    var obj = {
        "contextElements": [
            {
                "type": "Test",
                "isPattern": "false",
                "id":"Test",
                "attributes": []
            }
        ],
        "updateAction": "APPEND"
    };
    it('Should not return error', function() {
        expect(function(){
            createBoilerplateOrionObject("Test","Test","APPEND");
        }).to.not.throw();
    });
    it('non-empty', function(){
        assert.isNotNull(testBoilerplate);
    });
    it('simple-equal', function(){
        assert.deepEqual(obj,testBoilerplate);
    });

});
describe('createBoilerplateOrionAttribute', function(){
    var testBoilerplate = createBoilerplateOrionAttribute("Test","Test");
    var obj = {
        "name": "Test",
        "type": "string",
        "value": "Test"
    };
    it('Should not return error', function() {
        expect(function(){
            createBoilerplateOrionAttribute("Test","Test");
        }).to.not.throw();
    });
    it('non-empty', function(){
        assert.isNotNull(testBoilerplate);
    });
    it('simple-equal', function(){
        assert.deepEqual(obj,testBoilerplate);
    });
});
describe('orionBoilerplateAttributePusher', function(){
    var orionBoilerplate = createBoilerplateOrionObject("P2000", "Test", "APPEND_STRICT");
    var obj = {
        "_id" : "1606131518500222",
        "type" : "P2000",
        "isPattern" : "false",
        "attributes" : {
            "EST" : "B1 5641CG 16 : Citroenvlinderlaan Eindhoven Obj: Rit: 46686~",
            "coord_lat" : [
                "51.4517619"
            ],
            "coord_lng" : [
                "5.5163619"
            ],
            "description" : "1123109 MKA Brabant Zuid-Oost  Ambulance 22-109 Eindhoven ",
            "dt" : "1465823930000",
            "prio" : "B1",
            "publish_date" : "Mon, 13 Jun 2016 15:18:50 +0200",
            "restTitle" : ": Citroenvlinderlaan Eindhoven Obj: Rit: 46686~ ",
            "strLoc" : "Citroenvlinderlaan Eindhoven ",
            "type" : "Ambulance"
        }
    }
    var attrMap = {
        type: '',
        EST: "testTitle",
        description: '',
        dt: '',
        publish_date:'',
        coord_lat: '',
        coord_lng: '',
        prio: '',
        restTitle: '',
        strLoc: ''
    };
    it('Should not return error', function() {
        expect(function(){
            orionBoilerplateAttributePusher(orionBoilerplate,obj,attrMap);
        }).to.not.throw();
    });
})
