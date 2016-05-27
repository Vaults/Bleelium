/**
 * @summary Rewrites the attribute format of Orion into key = value
 * @param {array} attr - Atribute object from Orion
 * @returns Rewritten attribute as key=value
 */
var attributesToKeyValue = function (attr) {
    var temp = {}
    attr.forEach(function (o) {
        temp[o.name] = o.value;
    });
    return temp;
}
/**
 * @summary Loops through all the attributes and rewrites them to key = value
 * @param {json} obj - The Orion object
 * @param callback
 * @returns the complete Orion object with the attributes rewritten as key = value
 */
var rewriteAttributes = function (obj, callback) {
    if (!callback) {
        for (var i = 0; i < obj.data.contextResponses.length; i++) {
            var tempobj = obj.data.contextResponses[i].contextElement;
            tempobj.attributes = attributesToKeyValue(tempobj.attributes);
            tempobj._id = tempobj.id;
            delete tempobj.id;
        }
    }
    else {
        return callback(obj);
    }
    return obj;
}
/**
 * @summary Handles the error if there is one
 * @param c- callback
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
}
/**
 * @summary Adjust the Orion attribute for forecast data
 * @param {json} 0 - An orion attribute
 * @returns The adjusted Orion attribute for forecast
 */
var numToObj = function (o) {
    var tempobj = {forecast: {}};
    for(key in o){
        var fc = key.split('-')[0];
        if (fc >= 0 && fc <= 99) {
            if (!tempobj.forecast['day' + fc]) {
                tempobj.forecast['day' + fc] = {}
            }
            tempobj.forecast['day' + fc][key.split('-')[1]] = o[key];
        }else{
            tempobj[key] = o[key];
        }
    }
    return tempobj;
}
/**
 * @summary Adjust the Orion object so we are able to save forecast data
 * @param {json} obj - The Orion object
 * @returns The adjusted Orion object for forecast data
 */
var rewriteNumbersToObjects = function (obj) {
    for (var i = 0; i < obj.data.contextResponses.length; i++) {
        var tempobj = obj.data.contextResponses[i].contextElement;
        tempobj.attributes = numToObj(tempobj.attributes);
    }
    return obj;
}

export{attributesToKeyValue, rewriteAttributes, handleError, numToObj, rewriteNumbersToObjects}
