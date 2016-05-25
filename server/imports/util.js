var attributesToKeyValue = function (attr) {
                var temp = {}
                attr.forEach(function (o) {
                    temp[o.name] = o.value;
                });
                return temp;
            }

var rewriteAttributes = function (obj, callback) {
		if(!callback){
			for (var i = 0; i < obj.data.contextResponses.length; i++) {
					var tempobj = obj.data.contextResponses[i].contextElement;
					tempobj.attributes = attributesToKeyValue(tempobj.attributes);
					tempobj._id = tempobj.id;
					delete tempobj.id;
			}
		}
		else{
			return callback(obj);
		}
		return obj;
}

var handleError = function(c){
	return function(error, result){
		var thr = function(e){
			console.log("--- ERROR DETECTED ---");
			throw e;
			console.log("--- ERROR DETECTED ---");
		};
		if(error){
			if(error.statusCode) {
				if (error.statusCode == 200) { //workaround for vague bug
					c(error);
					return;
				}
			}
			thr(e);
		}
		c(result);
	}
}

var numToObj = function(o){
	o.forecast = {};
	for(key in o){
		var fc = key.charAt(0);
        if(fc >= 0 && fc <= 9){
			if(!o.forecast['day' + fc]){
				o.forecast['day' + fc] = {}
			}
			o.forecast['day' + fc][key.substr(2,key.length)] = o[key];
 			delete o[key];
		}
    }
    return o;
}

var rewriteNumbersToObjects = function(obj){
	for (var i = 0; i < obj.data.contextResponses.length; i++) {
		var tempobj = obj.data.contextResponses[i].contextElement;
		tempobj.attributes = numToObj(tempobj.attributes);
	}
	return obj;
}

export{attributesToKeyValue, rewriteAttributes, handleError, numToObj, rewriteNumbersToObjects}
/*
var Future = Npm.require('fibers/future');

Meteor.methods({
    'findWindDir': function (degrees) {
        //Set up future
        var future = new Future();
        var onComplete = future.resolver();

        var min = 360;
        var answer = '';

        for (var key in WIND_DIR) {
            if ((Math.abs(degrees - (WIND_DIR[key].deg)) < min)) {
                min = degrees - WIND_DIR[key].deg;
                answer = WIND_DIR[key].name;
               // console.log(answer)
            }
        }

        var error = 'ow shit'
        future.resolver(error,answer);

        return future;
        Future.wait(future);
    }
})
*/
