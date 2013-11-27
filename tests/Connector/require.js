require('should');
var blackstone = require('../../blackstone.js');

describe('Blackstone', function() {
    describe('Connector', function() {
        it('Require', function() {
            blackstone.should.be.an.instanceof(Blackstone);
        });
    });
});