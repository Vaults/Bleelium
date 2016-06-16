/**
 * @summary Checks whether an object has identical keys and values (deep), key order has no influence.
 * @param a JS-object
 * @param b JS-object to be checked
 * @returns true if object is equal (deep equal), false if not.
 */
var isEqual = function (a, b) {
    var checkObj = function (a, b) {
        if (!(a && b)) {
            return false;
        }
        var res = true;
        for (var key in a) {
            if (!(typeof a[key] === 'object' || Array.isArray(a[key]))) {
                res = res && a[key] === b[key];
            } else {
                if (a[key] && b[key]) {
                    res = res && checkObj(a[key], b[key]);
                } else {
                    res = false;
                }
            }
        }
        return res;
    };
    return checkObj(a, b) && checkObj(b, a);
};

/**
 * @summary Rewrites the attribute format of Orion into key = value
 * @param {array} attr - Atribute object from Orion
 * @returns {array} Rewritten attribute as key=value
 */
var attributesToKeyValue = function (attr) {
    var temp = {};
    attr.forEach(function (o) {
        temp[o.name] = o.value;
    });
    return temp;
};
/**
 * @summary Loops through all the attributes and rewrites them to key = value
 * @param {json} obj - The Orion object
 * @param {function} callback - callback
 * @returns {json} - the complete Orion object with the attributes rewritten as key = value
 */
var rewriteAttributes = function (obj, callback) {
    if (!callback) {
        for (var i = 0; i < obj.data.contextResponses.length; i++) {
            var tempObj = obj.data.contextResponses[i].contextElement;
            tempObj.attributes = attributesToKeyValue(tempObj.attributes);
            tempObj._id = tempObj.id;
            delete tempObj.id;
        }
    }
    else {
        return callback(obj);
    }
    return obj;
};
/**
 * @summary Handles the error if there is one
 * @param {function} c - callback function
 * @returns If there is no error the result is returned
 */
var handleError = function (c) {
    return function (error, result) {
        var thr = function (e) {
            throw e;
        };
        if (error) {
            if (error.statusCode) {
                if (error.statusCode == 200) { //workaround for vague bug
                    c(error);
                    return;
                }
            }
            thr(error);
        }
        c(result);
    }
};
/**
 * @summary Adjust the Orion attribute for forecast data
 * @param {json} o - An orion attribute
 * @returns {json} - The adjusted Orion attribute for forecast
 */
var numToObj = function (o) {
    var tempObj = {forecast: {}};
    for (key in o) {
        var fc = key.split('-')[0];
        if (fc >= 0 && fc <= 6) { //checks if number
            if (!tempObj.forecast['day' + fc]) {
                tempObj.forecast['day' + fc] = {}
            }
            tempObj.forecast['day' + fc][key.split('-')[1]] = o[key];
        } else {
            tempObj[key] = o[key];
        }
    }
    return tempObj;
};
/**
 * @summary Adjust the Orion object so we are able to save forecast data
 * @param {json} obj - The Orion object
 * @returns {json} - The adjusted Orion object for forecast data
 */
var rewriteNumbersToObjects = function (obj) {
    for (var i = 0; i < obj.data.contextResponses.length; i++) {
        var tempobj = obj.data.contextResponses[i].contextElement;
        tempobj.attributes = numToObj(tempobj.attributes);
    }
    return obj;
};
/**
 * @summary Creates a simple Orion object that can be directly POSTed to the Orion instance.
 * @param type - The type of entity sent
 * @param id - The unique ID for an entity
 * @param updateAction - Determines whether we insert, upsert or update
 * @returns {{contextElements: *[], updateAction: *}} - The respective Orion object
 */
var createBoilerplateOrionObject = function (type, id, updateAction) {
    return {
        "contextElements": [
            {
                "type": type,
                "isPattern": "false",
                "id": id,
                "attributes": []
            }
        ],
        "updateAction": updateAction
    };
};
/**
 * @summary Creates an attribute object for an Orion object
 * @param name - Attribute name
 * @param value - Attribute value
 * @returns {{name: *, type: string, value: *}} - The respective Orion object attribute
 */
var createBoilerplateOrionAttribute = function (name, value) {
    return {
        "name": name,
        "type": "string",
        "value": value
    };
};

/**
 * @summary Inserts key-value pairs into a valid Orion boilerplate
 * @param boiler - The respective boilerplate
 * @param obj - The data object
 * @param attrMap - The object that maps keys to values in the Orion object
 * @returns {*} - A valid Orion object with data that can be pushed to the Orion instance
 */
var orionBoilerplateAttributePusher = function (boiler, obj, attrMap) {
    for (var key in attrMap) {
        if (attrMap[key] === '') {
            boiler.contextElements[0].attributes.push(createBoilerplateOrionAttribute(key, obj[key]));
        } else {
            boiler.contextElements[0].attributes.push(createBoilerplateOrionAttribute(key, attrMap[key]))
        }
    }
    return boiler;
}
//exports for tests
export{
    attributesToKeyValue,
    rewriteAttributes,
    handleError,
    numToObj,
    rewriteNumbersToObjects,
    isEqual,
    createBoilerplateOrionObject,
    createBoilerplateOrionAttribute,
    orionBoilerplateAttributePusher
}
