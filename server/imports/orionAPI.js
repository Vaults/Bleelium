import {HTTP} from 'meteor/http';
import {rewriteAttributes, handleError} from '/server/imports/util.js';
import {ENDPOINT} from '/server/config.js';
/**
 * @summary Function to post data to Orion
 * @param {json} data - the data to post
 * @param callback - callback
 */
var postOrionData = function (data, callback) {
    HTTP.call('POST', ENDPOINT + ':1026/v1/updateContext', {data: data}, callback);
}
/**
 * @summary Pulls data from Orion
 * @param {string} coll - The collection to request data from
 * @param {string} args - Arguments to pass
 * @param {function} callback - callback
 */
var pull = function (coll, args, callback) {
    //console.log(query.data.entities[0]);
    HTTP.call('GET', ENDPOINT + ':1026/v1/contextEntityTypes/' + coll + args, handleError(function (response) {
        rewriteAttributes(response, callback);
    }));
};
/**
 * @summary Pulls data from orion every 5 seconds
 * @param {string} collection - The type to request data from
 * @param {string} args - Arguments to pass
 * @param {function} callback - callback
 */
var reloadPull = function (collection, args, callback) {
    pull(collection, args, callback);
    Meteor.setTimeout(function () {
        reloadPull(collection, args, callback)
    }, 5000);
}

//exports for tests
export {postOrionData, pull, reloadPull}
