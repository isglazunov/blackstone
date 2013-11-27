require('should');
var _ = require('lodash');
require('../../blackstone.js');

describe('Blackstone', function() {
    describe('Connector', function() {
        it('Global', function() {
            Blackstone.should.have.type('function');
            var blackstone = new Blackstone(_);
            blackstone.should.be.an.instanceof(Blackstone);
        });
    });
});