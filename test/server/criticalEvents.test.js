import { assert } from 'meteor/practicalmeteor:chai';

//to be tested functions
import {criticalEventPush,smokeSensorPull,gasSensorPull} from '/server/criticalEvents.js';


describe('gasSensorPull and smokeSensorPull and criticalEventPush()', function(){
    it('Should not return error', function() {
        expect(function(){
            var test1 = gasSensorPull;
            var test2 = smokeSensorPull;
        }).to.not.throw();
    });
});
