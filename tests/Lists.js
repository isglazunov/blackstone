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
        
        l1.append([s1, s2, s3]);
        
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
        
        s2.in(l1).append([s4, s5, s6]);
        
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
        l1.remove([s6, s3, s4]);
        
         // 1,5
         
        l1.first.should.be.eql(s1.in(l1));
        l1.first.next.should.be.eql(s5.in(l1));
        
        l1.last.prev.should.be.eql(s1.in(l1));
        l1.last.should.be.eql(s5.in(l1));
        
        l1.length.should.be.eql(2);
    });
    
    it('list.prepend', function() {
        l1.prepend([s6, s4, s2]);
        
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
        s4.in(l1).prepend([s3, s8, s7]);
        
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
    
    it('list.each', function() {
        var eached = false;
        l1.each(function(next, counter, sup) {
            if (counter == 0) sup.should.be.eql(s6);
            else if (counter == 1) sup.should.be.eql(s3);
            else if (counter == 2) sup.should.be.eql(s8);
            else if (counter == 3) sup.should.be.eql(s7);
            else if (counter == 4) sup.should.be.eql(s4);
            else if (counter == 5) sup.should.be.eql(s2);
            else if (counter == 6) sup.should.be.eql(s1);
            else if (counter == 7) sup.should.be.eql(s5);
            else eached = true;
    
            if (next) next();
        });
        eached.should.be.true;
    });
    
    it('list.each sync', function() {
        var eached = false;
        l1.each(function(counter, sup) {
            if (counter == 0) sup.should.be.eql(s6);
            else if (counter == 1) sup.should.be.eql(s3);
            else if (counter == 2) sup.should.be.eql(s8);
            else if (counter == 3) sup.should.be.eql(s7);
            else if (counter == 4) sup.should.be.eql(s4);
            else if (counter == 5) sup.should.be.eql(s2);
            else if (counter == 6) sup.should.be.eql(s1);
            else if (counter == 7) sup.should.be.eql(s5);
            else eached = true;
        }, { sync: true });
        eached.should.be.true;
    });
    
    it('list.each reverse', function() {
        var eached = false;
        l1.each(function(counter, sup) {
            if (counter == 0) sup.should.be.eql(s5);
            else if (counter == 1) sup.should.be.eql(s1);
            else if (counter == 2) sup.should.be.eql(s2);
            else if (counter == 3) sup.should.be.eql(s4);
            else if (counter == 4) sup.should.be.eql(s7);
            else if (counter == 5) sup.should.be.eql(s8);
            else if (counter == 6) sup.should.be.eql(s3);
            else if (counter == 7) sup.should.be.eql(s6);
            else eached = true;
        }, { reverse: true });
        eached.should.be.true;
    });
});