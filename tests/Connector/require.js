require('should');
var blackstone = require('../../blackstone.js');

it('Blackstone Connector', function(){
    Blackstone.should.have.type('function');
    blackstone.should.be.an.instanceof(Blackstone);
});