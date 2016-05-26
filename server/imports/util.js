/**
 *
 * @param attr
 * @returns {{}}
 */
var attributesToKeyValue = function (attr) {
    var temp = {}
    attr.forEach(function (o) {
        temp[o.name] = o.value;
    });
    return temp;
}
/**
 *
 * @param obj
 * @param callback
 * @returns {*}
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
 *
 * @param c
 * @returns {Function}
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
 *
 * @param o
 * @returns {*}
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
 *
 * @param obj
 * @returns {*}
 */
var rewriteNumbersToObjects = function (obj) {
    for (var i = 0; i < obj.data.contextResponses.length; i++) {
        var tempobj = obj.data.contextResponses[i].contextElement;
        tempobj.attributes = numToObj(tempobj.attributes);
    }
    return obj;
}

export{attributesToKeyValue, rewriteAttributes, handleError, numToObj, rewriteNumbersToObjects}