import {reloadPull} from "/server/imports/orionAPI.js";
import {weatherPull} from "/server/weather.js";
import {P2000Pull} from "/server/P2000.js";
import {gasSensorPull} from "/server/criticalEvents.js";
import {SoundDataPull} from "/server/soundSensor.js";

var initPulls = function(){
	reloadPull(weatherPull.name, weatherPull.args, weatherPull.f);
	reloadPull(P2000Pull.name, P2000Pull.args, P2000Pull.f );
	reloadPull(gasSensorPull.name, gasSensorPull.args, gasSensorPull.f );
	reloadPull(SoundDataPull.name, SoundDataPull.args, SoundDataPull.f );
}

if (!Meteor.isTest) { //only polls data getting/setting if the system is not in test mode
    SyncedCron.start();
	initPulls();
}

//exports for tests
export {initPulls}
