import { expect, assert } from 'meteor/practicalmeteor:chai';

//to be tested functions
import {SoundDataPull} from '/server/soundSensor.js';
import {pull} from '/server/imports/orionAPI.js'

describe('soundSensorPull', function(){
    it('Should not return error', function() {
        expect(function(){
            pull(SoundDataPull.name,SoundDataPull.args,SoundDataPull.f);
        }).to.not.throw();
    });
});
