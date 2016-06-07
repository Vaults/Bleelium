import { expect, assert } from 'meteor/practicalmeteor:chai';

//to be tested functions
import {SoundDataPull} from '/server/soundSensor.js';

describe('gasSensorPull and smokeSensorPull and criticalEventPush()', function(){
    it('Should not return error', function() {
        expect(function(){
            var test1 = SoundDataPull;
        }).to.not.throw();
    });
});
