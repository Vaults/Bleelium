import {collectionWrapper} from '/server/imports/collections.js';
import {rewriteAttributes} from '/server/imports/util.js';


/**
 *
 * @type {{name: string, args: string, f: P2000Pull.f}}
 */
var SoundDataPull = {
    name: 'SoundSensor',
    args: '?limit=1000',
    f: function (args) {
        response = rewriteAttributes(args);
        for (item in args.data.contextResponses) {
            var obj = args.data.contextResponses[item].contextElement;
            collectionWrapper['SoundSensor'].upsert({_id: obj._id}, {$set: obj});
        }
    }
}

//exports for tests
export {SoundDataPull}
