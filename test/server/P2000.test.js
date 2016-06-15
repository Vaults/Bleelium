import {expect, assert} from 'meteor/practicalmeteor:chai';
//to be tested functions
import {pushP2000ToOrion, P2000Pull, countSecurity} from '/server/P2000.js';
import {pull} from '/server/imports/orionAPI.js';

describe('P2000Pull() and pushP2000ToOrion()', function () {
    it('Should not return error', function () {
        expect(function () {
            pushP2000ToOrion();
        }).to.not.throw();
    });
});
describe('countSecurity()', function () {
    it('Should not return error', function () {
        expect(function () {
            countSecurity();
        }).to.not.throw();
    });
    it('Should not null', function () {
        assert.isNotNull(countSecurity());
    });
    var pipeline = {$match: {'attributes.dt': {$gte: (new Date().getTime() - 24 * 60 * 60 * 1000) + ''}}};
});
