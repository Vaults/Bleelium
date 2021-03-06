import {Meteor} from 'meteor/meteor';
import {expect,assert} from 'meteor/practicalmeteor:chai';
import {isEqual} from '/server/imports/util.js';

//to be tested functions
import {
    parseData,
    geoLoc,
    generateFakeCoords,
    ambulanceInfo,
    createP2000Data
} from '/server/P2000DataSplitter.js';


var inputData = function () {
        return {
            title: ['A2 (DIA: ) 5531AG 22 : Raambrug Bladel Obj: Rit: 41269~'],
            link: ['http://monitor.livep2000.nl?SPI=1605261117520222'],
            description: ['1123117 <i name=w21 class=wb>MKA</i> Brabant Zuid-Oost ( <i name=w3910 class=wb>Ambulance</i> <i name=w3794 class=wb>22-117</i> Eersel )<br/>'],
            pubDate: ['Thu, 26 May 2016 11:17:52 +0200'],
            guid: [{_: '1605261117520222', '$': [Object]}],
            'geo:lat': ['51.3595589'],
            'geo:long': ['5.2060685']
        }
    };

describe('Error', function(){
    it('should throw err', function () {
        expect(function(){
            createP2000Data(0);
        }).to.throw();
    });
});
describe('No Error', function(){
    var res = inputData();
    it('should not throw error', function () {
        expect(function(){
            createP2000Data(res);
        }).to.not.throw();
    });
});
describe('parseData()', function () {
    var testData = inputData();
    var res = createP2000Data(testData);

    it('Should divide correctly', function() {
        assert.isTrue(res.contextElements[0].attributes[7].value == 'A2')
    });

    testData.description = 'Brandweer';

    it('Should divide correctly', function() {
        expect(function(){
            createP2000Data(testData);
        }).to.not.throw();
    });

    testData.description = 'Politie';

    it('Should divide correctly', function() {
        expect(function(){
            createP2000Data(testData);
        }).to.not.throw();
    });
});
describe('ambulanceInfo()', function () {
    var res = createP2000Data(inputData());

    it('should return object with correct ambulance info', function () {
        assert.equal(res.contextElements[0].attributes[7].value, 'A2' );
        assert.equal(res.contextElements[0].attributes[8].value, '22 : Raambrug Bladel Obj: Rit: 41269~ ' );
        assert.equal(res.contextElements[0].attributes[9].value, 'Raambrug Bladel ' );
    });
});
describe('createP2000Data()', function () {
    var outputData = {
        contextElements: [{
            type: 'P2000',
            isPattern: 'false',
            id: '1605261117520222',
            attributes: [{
                name: 'type',
                type: 'string',
                value: 'Ambulance'
            }, {
                name: 'EST',
                type: 'string',
                value: 'A2  5531AG 22 : Raambrug Bladel Obj: Rit: 41269~'
            }, {
                name: 'description',
                type: 'string',
                value: '1123117 MKA Brabant Zuid-Oost  Ambulance 22-117 Eersel '
            }, { name: 'dt', type: 'string', value: '1464254272000' },{
                name: 'publish_date',
                type: 'string',
                value: 'Thu, 26 May 2016 11:17:52 +0200'
            }, {
                name: 'coord_lat',
                type: 'string',
                value: ['51.3595589']
            }, {
                name: 'coord_lng',
                type: 'string',
                value: ['5.2060685']
            }, {
                name: 'prio',
                type: 'string',
                value: 'A2'
            }, {name: 'restTitle', type: 'string', value: '22 : Raambrug Bladel Obj: Rit: 41269~ '}, {
                name: 'strLoc',
                type: 'string',
                value: 'Raambrug Bladel '
            }]
        }], updateAction: 'APPEND_STRICT'
    }
    it('should return object with P2000 data format we specified', function () {
        var res = createP2000Data(inputData());
        assert.isTrue(isEqual(res, outputData));
    });
});
describe('geoLoc()', function () {
    it('should set coordinates', function () {
        var testData = inputData();
        testData['geo:lat'][0] = null;
        testData['geo:long'][0] = null;
        var res = createP2000Data(testData);
        assert.isNotNull(testData['geo:lat']);
        assert.isNotNull(testData['geo:long']);
        assert.isNotNull(testData.falseFlag);
    });
    it('should not change input coordinates', function () {
        var res = createP2000Data(inputData());
        assert.equal(res.contextElements[0].attributes[5].value[0], inputData()['geo:lat'][0]);
        assert.equal(res.contextElements[0].attributes[6].value[0], inputData()['geo:long'][0]);
    });

});
describe('generateFakeCoords()', function () {
    it('should return coordinates in the correct range', function () {
        for (i = 0; i < 100; i++) {
            inputData()['geo:lat'][0] = null;
            inputData()['geo:long'][0] = null;
            var res = createP2000Data(inputData());
            //enerateFakeCoords(res);
            assert.isTrue(res.contextElements[0].attributes[5].value[0] > 51.23 && res.contextElements[0].attributes[5].value[0] < 51.50);
            assert.isTrue(res.contextElements[0].attributes[6].value[0] > 5.2 && res.contextElements[0].attributes[6].value[0] < 5.60);
        }
    });
});



