import {expect,assert} from 'meteor/practicalmeteor:chai';
//to be tested functions
import {pushP2000ToOrion, P2000Pull} from '/server/P2000.js';
import {pull} from '/server/imports/orionAPI.js';

describe('P2000Pull() and pushP2000ToOrion()', function(){
    it('Should not return error', function() {
        expect(function(){
            pushP2000ToOrion();
        }).to.not.throw();
    });
});
