require('should');
var requirejs = require('requirejs');

requirejs.config({
    paths: {
        'blackstone': __dirname + '/../../blackstone'
    } 
});

it('Blackstone Connector', function(done){
    requirejs(['blackstone'], function(blackstone){
        blackstone.should.be.an.instanceof(Blackstone);
        done();
    });
});