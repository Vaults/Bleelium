import {Meteor} from 'meteor/meteor';
import {assert} from 'meteor/practicalmeteor:chai';
import {Mongo} from 'meteor/mongo';
import {collectionWrapper} from '/server/imports/collections.js';

//to be tested functions
import {geoLoc, generateFakeCoords, policeInfo, ambulanceInfo, createP2000Data} from '/server/P2000DataSplitter.js';


var inputData = { title: [ 'A2 (DIA: ) 5531AG 22 : Raambrug Bladel Obj: Rit: 41269~' ], link: [ 'http://monitor.livep2000.nl?SPI=1605261117520222' ], description: [ '1123117 <i name=w21 class=wb>MKA</i> Brabant Zuid-Oost ( <i name=w3910 class=wb>Ambulance</i> <i name=w3794 class=wb>22-117</i> Eersel )<br/>' ], pubDate: [ 'Thu, 26 May 2016 11:17:52 +0200' ], guid: [ { _: '1605261117520222', '$': [Object] } ], 'geo:lat': [ '51.3595589' ], 'geo:long': [ '5.2060685' ] }

describe('createP2000Data()', function () {
    //no tests yet
});
describe('pushP2000ToOrion()', function () {
    //no tests yet
});
describe('parseData()', function () {
    //no tests yet
});
describe('ambulanceInfo()', function () {
    it('should return object with correct ambulance info', function () {

    });
});
describe('policeInfo()', function () {
    it('should return object with correct police info', function () {

    });
});
describe('createP2000Data()', function () {
    var outputData = { contextElements: [ { type: 'P2000', isPattern: 'false', id: '1605261117520222', attributes: [ { name: 'EST', type: 'string', value: 'A2  5531AG 22 : Raambrug Bladel Obj: Rit: 41269~' }, { name: 'description', type: 'string', value: '1123117 MKA Brabant Zuid-Oost  Ambulance 22-117 Eersel ' }, { name: 'publish_date', type: 'string', value: 'Thu, 26 May 2016 11:17:52 +0200' }, { name: 'coord_lat', type: 'string', value: [ '51.3595589' ] }, { name: 'coord_lng', type: 'string', value: [ '5.2060685' ] }, { name: 'prio', type: 'string', value: 'A2' }, { name: 'restTitle', type: 'string', value: '22 : Raambrug Bladel Obj: Rit: 41269~ ' }, { name: 'strLoc', type: 'string', value: 'Raambrug Bladel ' }, { name: 'info', type: 'string', value: false } ] } ], updateAction: 'APPEND' }
    it('should return object with P2000 data format we specified', function () {
        var res = createP2000Data(inputData);
            assert.equal(res.contextElements[0].attributes[0].value, outputData.contextElements[0].attributes[0].value);
            assert.equal(res.contextElements[0].attributes[1].value, outputData.contextElements[0].attributes[1].value);
            assert.equal(res.contextElements[0].attributes[2].value, outputData.contextElements[0].attributes[2].value);
            assert.equal(res.contextElements[0].attributes[3].value[0], outputData.contextElements[0].attributes[3].value[0]);
    });
});
describe('geoLoc()', function () {
    it('should return Coordinates between ', function () {
        inputData['geo:lat'][0] = null;
        geoLoc(inputData);
            assert.isNotNull(inputData['geo:lat']);
            assert.isNotNull(inputData.falseFlag);
    });
});
describe('generateFakeCoords()', function () {
    it('should return first word of the description string ', function () {

    });
});



