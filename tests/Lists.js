require('should');
var blackstone = require('../blackstone.js');
var lodash = require('lodash');
var List = blackstone.lists.List;
var Position = blackstone.lists.Position;
var Super = blackstone.lists.Superposition;

describe('Blackstone Lists', function() {
    
    var l1 = new List;
    
    var s1, s2, s3;
    it('list.append', function() {
        s1 = new Super;
        s2 = new Super;
        s3 = new Super;
        
        l1.append(s1, s2, s3);
        
        // 1,2,3
        
        l1.first.should.be.eql(s1.in(l1));
        l1.first.next.should.be.eql(s2.in(l1));
        l1.first.next.next.should.be.eql(s3.in(l1));
        
        l1.last.prev.prev.should.be.eql(s1.in(l1));
        l1.last.prev.should.be.eql(s2.in(l1));
        l1.last.should.be.eql(s3.in(l1));
        
        l1.length.should.be.eql(3);
    });
    
    var s4, s5, s6;
    it('position.append', function() {
        s4 = new Super;
        s5 = new Super;
        s6 = new Super;
        
        s2.in(l1).append(s4, s5, s6);
        
        // 1,2,4,5,6,3
        
        l1.first.should.be.eql(s1.in(l1));
        l1.first.next.should.be.eql(s2.in(l1));
        l1.first.next.next.should.be.eql(s4.in(l1));
        l1.first.next.next.next.should.be.eql(s5.in(l1));
        l1.first.next.next.next.next.should.be.eql(s6.in(l1));
        l1.first.next.next.next.next.next.should.be.eql(s3.in(l1));
        
        l1.last.prev.prev.prev.prev.prev.should.be.eql(s1.in(l1));
        l1.last.prev.prev.prev.prev.should.be.eql(s2.in(l1));
        l1.last.prev.prev.prev.should.be.eql(s4.in(l1));
        l1.last.prev.prev.should.be.eql(s5.in(l1));
        l1.last.prev.should.be.eql(s6.in(l1));
        l1.last.should.be.eql(s3.in(l1));
        
        l1.length.should.be.eql(6);
    });
    
    it('position.remove', function() {
        s2.in(l1).remove();
        
        // 1,4,5,6,3
        
        l1.first.should.be.eql(s1.in(l1));
        l1.first.next.should.be.eql(s4.in(l1));
        l1.first.next.next.should.be.eql(s5.in(l1));
        l1.first.next.next.next.should.be.eql(s6.in(l1));
        l1.first.next.next.next.next.should.be.eql(s3.in(l1));
        
        l1.last.prev.prev.prev.prev.should.be.eql(s1.in(l1));
        l1.last.prev.prev.prev.should.be.eql(s4.in(l1));
        l1.last.prev.prev.should.be.eql(s5.in(l1));
        l1.last.prev.should.be.eql(s6.in(l1));
        l1.last.should.be.eql(s3.in(l1));
        
        l1.length.should.be.eql(5);
    });
    
    
    it('list.remove', function() {
        l1.remove(s6, s3, s4);
        
         // 1,5
         
        l1.first.should.be.eql(s1.in(l1));
        l1.first.next.should.be.eql(s5.in(l1));
        
        l1.last.prev.should.be.eql(s1.in(l1));
        l1.last.should.be.eql(s5.in(l1));
        
        l1.length.should.be.eql(2);
    });
    
    it('list.prepend', function() {
        l1.prepend(s6, s4, s2);
        
        // 6,4,2,1,5
        
        l1.first.should.be.eql(s6.in(l1));
        l1.first.next.should.be.eql(s4.in(l1));
        l1.first.next.next.should.be.eql(s2.in(l1));
        l1.first.next.next.next.should.be.eql(s1.in(l1));
        l1.first.next.next.next.next.should.be.eql(s5.in(l1));
        
        l1.last.prev.prev.prev.prev.should.be.eql(s6.in(l1));
        l1.last.prev.prev.prev.should.be.eql(s4.in(l1));
        l1.last.prev.prev.should.be.eql(s2.in(l1));
        l1.last.prev.should.be.eql(s1.in(l1));
        l1.last.should.be.eql(s5.in(l1));
        
        l1.length.should.be.eql(5);
    });
    
    
    var s7, s8;
    it('position.prepend', function() {
        s7 = new Super;
        s8 = new Super;
        s4.in(l1).prepend(s3, s8, s7);
        
        // 6,3,8,7,4,2,1,5
        
        l1.first.should.be.eql(s6.in(l1));
        l1.first.next.should.be.eql(s3.in(l1));
        l1.first.next.next.should.be.eql(s8.in(l1));
        l1.first.next.next.next.should.be.eql(s7.in(l1));
        l1.first.next.next.next.next.should.be.eql(s4.in(l1));
        l1.first.next.next.next.next.next.should.be.eql(s2.in(l1));
        l1.first.next.next.next.next.next.next.should.be.eql(s1.in(l1));
        l1.first.next.next.next.next.next.next.next.should.be.eql(s5.in(l1));
        
        l1.last.prev.prev.prev.prev.prev.prev.prev.should.be.eql(s6.in(l1));
        l1.last.prev.prev.prev.prev.prev.prev.should.be.eql(s3.in(l1));
        l1.last.prev.prev.prev.prev.prev.should.be.eql(s8.in(l1));
        l1.last.prev.prev.prev.prev.should.be.eql(s7.in(l1));
        l1.last.prev.prev.prev.should.be.eql(s4.in(l1));
        l1.last.prev.prev.should.be.eql(s2.in(l1));
        l1.last.prev.should.be.eql(s1.in(l1));
        l1.last.should.be.eql(s5.in(l1));
        
        l1.length.should.be.eql(8);
    });
    
    var Eql = function(iter, now) {
        return function(sup) {
            return now.id == sup.id;
        };
    };
    
    it('list.each', function(done) {
        var eached = false;
        l1.each(function(sup, position) {
            var eql = Eql(this, sup);
            
            if (this.counter == 0) eql(s6);
            if (this.counter == 1) eql(s3);
            if (this.counter == 2) eql(s8);
            if (this.counter == 3) eql(s7);
            if (this.counter == 4) eql(s4);
            if (this.counter == 5) eql(s2);
            if (this.counter == 6) eql(s1);
            if (this.counter == 7) eql(s5);
            
            if (this.counter == 7) eached = true;
    
            if (this.next) this.next();
        }, {callback: function() {
            eached.should.be.true;
            done();
        }});
    });
    
    it('list.each sync', function() {
        var eached = false;
        l1.each(function(sup, position) {
            var eql = Eql(this, sup);
            
            if (this.counter == 0) eql(s6);
            if (this.counter == 1) eql(s3);
            if (this.counter == 2) eql(s8);
            if (this.counter == 3) eql(s7);
            if (this.counter == 4) eql(s4);
            if (this.counter == 5) eql(s2);
            if (this.counter == 6) eql(s1);
            if (this.counter == 7) eql(s5);
            
            if (this.counter == 7) eached = true;
        }, { sync: true });
        eached.should.be.true;
    });
    
    it('list.each reverse', function() {
        var eached = false;
        l1.each(function(sup, position) {
            var eql = Eql(this, sup);
            
            if (this.counter == 0) eql(s5);
            if (this.counter == 1) eql(s1);
            if (this.counter == 2) eql(s2);
            if (this.counter == 3) eql(s4);
            if (this.counter == 4) eql(s7);
            if (this.counter == 5) eql(s8);
            if (this.counter == 6) eql(s3);
            if (this.counter == 7) eql(s6);
            
            if (this.counter == 7) eached = true;
        }, { reverse: true });
        eached.should.be.true;
    });
});