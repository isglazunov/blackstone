require('should');
var blackstone = require('../blackstone.js');
var lodash = require('lodash');
var List = blackstone.List;
var Position = blackstone.Position;
var Super = blackstone.Superposition;

describe('Blackstone Lists', function() {
    
    it('should verify general state', function(){
        
        var l = {};
        
        var s = {};
        
        l[1] = new List; // []
        
        s[1] = new Super;
        s[2] = new Super;
        s[3] = new Super;
        
        l[1].append([s[1], s[2], s[3]]); // [1,2,3]
        
        l[1].first.should.be.eql(s[1].in(l[1]));
        l[1].first.next.should.be.eql(s[2].in(l[1]));
        l[1].first.next.next.should.be.eql(s[3].in(l[1]));
        
        l[1].last.prev.prev.should.be.eql(s[1].in(l[1]));
        l[1].last.prev.should.be.eql(s[2].in(l[1]));
        l[1].last.should.be.eql(s[3].in(l[1]));
        
        l[1].length.should.be.eql(3);
        
        s[4] = new Super;
        s[5] = new Super;
        s[6] = new Super;
        
        s[2].in(l[1]).append([s[4], s[5], s[6]]); // [1,2,4,5,6,3]
        
        l[1].first.should.be.eql(s[1].in(l[1]));
        l[1].first.next.should.be.eql(s[2].in(l[1]));
        l[1].first.next.next.should.be.eql(s[4].in(l[1]));
        l[1].first.next.next.next.should.be.eql(s[5].in(l[1]));
        l[1].first.next.next.next.next.should.be.eql(s[6].in(l[1]));
        l[1].first.next.next.next.next.next.should.be.eql(s[3].in(l[1]));
        
        l[1].last.prev.prev.prev.prev.prev.should.be.eql(s[1].in(l[1]));
        l[1].last.prev.prev.prev.prev.should.be.eql(s[2].in(l[1]));
        l[1].last.prev.prev.prev.should.be.eql(s[4].in(l[1]));
        l[1].last.prev.prev.should.be.eql(s[5].in(l[1]));
        l[1].last.prev.should.be.eql(s[6].in(l[1]));
        l[1].last.should.be.eql(s[3].in(l[1]));
        
        l[1].length.should.be.eql(6);
        
        s[2].in(l[1]).remove(); // [1,4,5,6,3]
        l[1].remove([s[6], s[3], s[4]]); // [1,5]
        
        l[1].first.should.be.eql(s[1].in(l[1]));
        l[1].first.next.should.be.eql(s[5].in(l[1]));
        
        l[1].last.prev.should.be.eql(s[1].in(l[1]));
        l[1].last.should.be.eql(s[5].in(l[1]));
        
        l[1].length.should.be.eql(2);
        
        l[1].prepend([s[6], s[4], s[2]]); // [6,4,2,1,5]
        
        l[1].first.should.be.eql(s[6].in(l[1]));
        l[1].first.next.should.be.eql(s[4].in(l[1]));
        l[1].first.next.next.should.be.eql(s[2].in(l[1]));
        l[1].first.next.next.next.should.be.eql(s[1].in(l[1]));
        l[1].first.next.next.next.next.should.be.eql(s[5].in(l[1]));
        
        l[1].last.prev.prev.prev.prev.should.be.eql(s[6].in(l[1]));
        l[1].last.prev.prev.prev.should.be.eql(s[4].in(l[1]));
        l[1].last.prev.prev.should.be.eql(s[2].in(l[1]));
        l[1].last.prev.should.be.eql(s[1].in(l[1]));
        l[1].last.should.be.eql(s[5].in(l[1]));
        
        l[1].length.should.be.eql(5);
        
        s[7] = new Super;
        s[8] = new Super;
        s[4].in(l[1]).prepend([s[3], s[8], s[7]]); // [6,3,8,7,4,2,1,5]
        
        l[1].first.should.be.eql(s[6].in(l[1]));
        l[1].first.next.should.be.eql(s[3].in(l[1]));
        l[1].first.next.next.should.be.eql(s[8].in(l[1]));
        l[1].first.next.next.next.should.be.eql(s[7].in(l[1]));
        l[1].first.next.next.next.next.should.be.eql(s[4].in(l[1]));
        l[1].first.next.next.next.next.next.should.be.eql(s[2].in(l[1]));
        l[1].first.next.next.next.next.next.next.should.be.eql(s[1].in(l[1]));
        l[1].first.next.next.next.next.next.next.next.should.be.eql(s[5].in(l[1]));
        
        l[1].last.prev.prev.prev.prev.prev.prev.prev.should.be.eql(s[6].in(l[1]));
        l[1].last.prev.prev.prev.prev.prev.prev.should.be.eql(s[3].in(l[1]));
        l[1].last.prev.prev.prev.prev.prev.should.be.eql(s[8].in(l[1]));
        l[1].last.prev.prev.prev.prev.should.be.eql(s[7].in(l[1]));
        l[1].last.prev.prev.prev.should.be.eql(s[4].in(l[1]));
        l[1].last.prev.prev.should.be.eql(s[2].in(l[1]));
        l[1].last.prev.should.be.eql(s[1].in(l[1]));
        l[1].last.should.be.eql(s[5].in(l[1]));
        
        l[1].length.should.be.eql(8);
    });
    
});