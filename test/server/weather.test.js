import { assert } from 'meteor/practicalmeteor:chai';
import { expect } from 'meteor/practicalmeteor:chai';


//to be tested functions
import {createWeatherData, createForecastData, pushWeatherToOrion, pushForecastToOrion} from '/server/weather.js';


describe('createWeatherData()', function(){
	var data = {"coord":{"lon":5.48,"lat":51.44},"weather":[{"id":701,"main":"Mist","description":"mist","icon":"50d"},{"id":741,"main":"Fog","description":"fog","icon":"50d"}],"base":"cmc stations","main":{"temp":14.07,"pressure":1017,"humidity":77,"temp_min":11,"temp_max":21.11},"wind":{"speed":2.6,"deg":40},"clouds":{"all":20},"dt":1464247543,"sys":{"type":1,"id":5208,"message":0.0059,"country":"NL","sunrise":1464233509,"sunset":1464291561},"id":2756253,"name":"Eindhoven","cod":200};
    it('creates weatherData correctly', function(){
        var res = createWeatherData(data);
        assert.equal(res.contextElements[0].type, "WeatherStation");
        assert.equal(res.contextElements[0].attributes[2].value, data.coord.lon);
        assert.equal(res.contextElements[0].attributes[4].type, "string");
        assert.equal(res.contextElements[0].attributes[7].name, "temp");
        assert.equal(res.contextElements[0].attributes[16].value, data.sys.sunset);
    });
});
describe('createForecastData()', function(){
	var data = {"dt":1464260400,"temp":{"day":21.39,"min":14.97,"max":21.39,"night":14.97,"eve":19.93,"morn":15.48},"pressure":1018.28,"humidity":82,"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01d"}],"speed":2.01,"deg":34,"clouds":0};
    it('creates forecastData correctly', function(){
        var res = createForecastData(data, 1, 2754447);
        assert.equal(res.contextElements[0].type, "WeatherStation");
        assert.equal(res.contextElements[0].attributes[0].value, data.dt);
        assert.equal(res.contextElements[0].attributes[4].type, "string");
        assert.equal(res.contextElements[0].attributes[5].name, "1-min");
        assert.equal(res.contextElements[0].attributes[6].value, data.temp.max);
    });
});
describe('pushWeatherToOrion & pushForecastToOrion()', function(){
	it('correctly pushes', function(){
        expect(function(){
            pushWeatherToOrion();
            pushForecastToOrion();
        }).to.not.throw();
    })
});