import {reloadPull} from '/server/imports/orionAPI.js';
import {weatherPull} from '/server/weather.js';
import {P2000Pull} from '/server/P2000.js';


var initPulls = function(){
	reloadPull(weatherPull.name, weatherPull.f);
	reloadPull(P2000Pull.name, P2000Pull.f);
}	

if (!Meteor.isTest) { //only polls data getting/setting if the system is not in test mode
    SyncedCron.start();
	initPulls();
}


//exports for tests
export {initPulls}
