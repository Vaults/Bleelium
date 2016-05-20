var attributesToKeyValue = function (attr) {
                var temp = {}
                attr.forEach(function (o) {
                    temp[o.name] = o.value;
                });
                return temp;
            }
<<<<<<< HEAD
var rewriteAndInsertAttributes = function (obj, callback) {
	if(!callback){
		collection.remove({});
		for (var i = 0; i < obj.data.contextResponses.length; i++) {
			var tempobj = obj.data.contextResponses[i].contextElement;
			tempobj.attributes = attributesToKeyValue(tempobj.attributes);

				collection.insert(tempobj);
=======
var rewriteAttributes = function (obj, callback) {
		if(!callback){
			for (var i = 0; i < obj.data.contextResponses.length; i++) {
					var tempobj = obj.data.contextResponses[i].contextElement;
					tempobj.attributes = attributesToKeyValue(tempobj.attributes);
			}
>>>>>>> cc38db73aba6da55093e68c9d0d0e2e6d850dbf9
		}
		else{
			return callback(obj);
		}
		return obj;
}

export{attributesToKeyValue, rewriteAttributes}
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
