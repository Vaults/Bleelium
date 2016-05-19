import { Meteor } from 'meteor/meteor';
import { assert } from 'meteor/practicalmeteor:chai';
import { Mongo } from 'meteor/mongo';


//to be tested functions
import {pull} from '/server/main.js';
import {dataIDmap} from '/server/main.js';

WeatherStations = new Mongo.Collection('weatherStations');

console.log("Test loaded.");
function add() {
	console.log(pull);
  return Array.prototype.slice.call(arguments).reduce(function(prev, curr) {
    return prev + curr;
  }, 0);
}

describe('Pull pulls to the database', function() {
	var len = Objects.keys(dataIDmap).length;
	it('correctly adds' + len + 'weatherstations to the database'){
		assert.equal(WeatherStations.find().count(), len);
	}
	
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


