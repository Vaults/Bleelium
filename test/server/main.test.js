import { Meteor } from 'meteor/meteor';
import { assert } from 'meteor/practicalmeteor:chai';
import { Mongo } from 'meteor/mongo';
import {WeatherStations} from '/server/main.js';

//to be tested functions
import {pull} from '/server/main.js';
import {dataIDmap} from '/server/main.js';

console.log("Test loaded.");
function add() {
  return Array.prototype.slice.call(arguments).reduce(function(prev, curr) {
    return prev + curr;
  }, 0);
}

describe('Pull pulls to the database', function() {

	it('correctly adds all weatherstations to the database within 1 second.', function(){
		pull();
		var len = Object.keys(dataIDmap).length;
		Meteor.setTimeout(function(){
			for(key in dataIDmap){
				assert.isTrue(WeatherStations.findOne({"id": key})); //checks if all entries in dataIDmap exist
			}
			assert.isFalse(WeatherStations.findOne({"id": -1})); //checks if it doesn't always return true for non-existing values
		}, 1000);
	});
	
	it('test', function(){
		console.log("WAT");
		assert.equal(true,true);
	});
	
  /*
  var tests = [
    {args: [1, 2],       expected: 3},
    {args: [1, 2, 3],    expected: 6},
    {args: [1, 2, 3, 4], expected: 10},
  ];

  tests.forEach(function(test) {
    it('correctly adds ' + test.args.length + ' args', function() {
      var res = add.apply(null, test.args);
      assert.equal(res, test.expected);
    });
  });
  */
});

