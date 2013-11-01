require('should');
var requirejs = require('requirejs');

requirejs.config({
    paths: {
        'blackstone': __dirname + '/../../blackstone'
    } 
});

describe('blackstone', function(){
    it('it should return an instance of blackstone', function(done){
        requirejs(['blackstone'], function(blackstone){
            blackstone.should.be.an.instanceof(Blackstone);
            done();
        });
    });
});