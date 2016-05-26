import { assert } from 'meteor/practicalmeteor:chai';
import { expect } from 'meteor/practicalmeteor:chai';

//to be tested functions
import {attributesToKeyValue, rewriteAttributes, handleError, numToObj, rewriteNumbersToObjects} from '/server/imports/util.js';
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
