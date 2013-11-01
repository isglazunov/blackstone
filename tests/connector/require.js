require('should');
var blackstone = require('../../blackstone.js');

describe('blackstone', function(){
    it('should be available in the global object', function(){
        Blackstone.should.have.type('function');
    });
    it('should be an instance of the constructor function', function(){
        blackstone.should.be.an.instanceof(Blackstone);
    });
});