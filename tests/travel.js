require('should');
var blackstone = require('../blackstone.js');
var lodash = require('lodash');
var travel = blackstone.travel;

it('travel', function(done) {
    
    var o0 = new Object;
    var o1 = new Object;
    var o2 = new Object;
    
    var i = 0;
    travel(function(o) {
        
        i++;
        
        if (i == 1) {
            o.should.equal(o0);
            this.next(o2);
        } else if (i == 2) {
            o.should.equal(o2);
            this.next(o1);
        } else if (i == 3) {
            o.should.equal(o1);
            
            done();
        }
        
    }, o0);
    
});
