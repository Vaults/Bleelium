import { expect, assert } from 'meteor/practicalmeteor:chai';

//to be tested functions
import {pull} from '/server/imports/orionAPI.js'
import {criticalEventPush,smokeSensorPull,gasSensorPull} from '/server/criticalEvents.js';


describe('gasSensorPull and smokeSensorPull and criticalEventPush()', function(){
    it('Should not return error', function() {
        expect(function(){
            pull(gasSensorPull.name,gasSensorPull.args,gasSensorPull.f);
            pull(smokeSensorPull.name,smokeSensorPull.args,smokeSensorPull.f);
        }).to.not.throw();
    });
});
