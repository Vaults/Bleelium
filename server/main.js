import {reloadPull} from '/server/imports/orionAPI.js';
import {weatherPull} from '/server/weather.js';
import {P2000Pull} from '/server/P2000.js';
import {gasSensorPull, smokeSensorPull} from '/server/criticalEvents.js';
import {SoundDataPull} from "/server/soundSensor.js";
import {ParkingAreaPull} from "/server/parking.js";

/**
 * @summary Initializes all the pulls
 */
var initPulls = function () {
    reloadPull(weatherPull.name, weatherPull.args, weatherPull.f);
    reloadPull(P2000Pull.name, P2000Pull.args, P2000Pull.f);
    reloadPull(gasSensorPull.name, gasSensorPull.args, gasSensorPull.f);
    reloadPull(smokeSensorPull.name, smokeSensorPull.args, smokeSensorPull.f);
    reloadPull(SoundDataPull.name, SoundDataPull.args, SoundDataPull.f);


    reloadPull(ParkingAreaPull.name, ParkingAreaPull.args, ParkingAreaPull.f);

};

/**
 * @summary Starts the cronjob and the pulls
 */
if (!Meteor.isTest) {
    SyncedCron.start();
    initPulls();
}
//exports for tests
export {initPulls}
