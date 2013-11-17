require('should');
var blackstone = require('../blackstone.js');
var _ = require('lodash');
var List = blackstone.lists.List;
var Position = blackstone.lists.Position;
var Super = blackstone.lists.Superposition;

describe('Blackstone Lists', function() {
    
    var eql = function(first, second) {
        first.id.should.be.eql(second.id);
    };
    
    it('list.append', function() {
        var l = new List;
        
        var s0 = new Super;
        
        l.append(s0);
        
        eql(l.first.super, s0);
        _.isUndefined(l.first.next).should.be.true;
        eql(l.last.super, s0);
        _.isUndefined(l.last.prev).should.be.true;
        
        l.append(s0);
        
        eql(l.first.super, s0);
        _.isUndefined(l.first.next).should.be.true;
        eql(l.last.super, s0);
        _.isUndefined(l.last.prev).should.be.true;
        
        var s1 = new Super;
        
        l.append(s1);
        
        eql(l.first.super, s0);
        eql(l.first.next.super, s1);
        eql(l.last.super, s1);
        eql(l.last.prev.super, s0);
        
        var s2 = new Super;
        
        l.append(s2);
        
        eql(l.first.super, s0);
        eql(l.first.next.super, s1);
        eql(l.first.next.next.super, s2);
        eql(l.last.super, s2);
        eql(l.last.prev.super, s1);
        eql(l.last.prev.prev.super, s0);
    });
    
    it('list.prepend', function() {
        var l = new List;
        
        var s0 = new Super;
        
        l.prepend(s0);
        
        eql(l.first.super, s0);
        _.isUndefined(l.first.next).should.be.true;
        eql(l.last.super, s0);
        _.isUndefined(l.last.prev).should.be.true;
        
        l.prepend(s0);
        
        eql(l.first.super, s0);
        _.isUndefined(l.first.next).should.be.true;
        eql(l.last.super, s0);
        _.isUndefined(l.last.prev).should.be.true;
        
        var s1 = new Super;
        
        l.prepend(s1);
        
        eql(l.first.super, s1);
        eql(l.first.next.super, s0);
        eql(l.last.super, s0);
        eql(l.last.prev.super, s1);
        
        var s2 = new Super;
        
        l.prepend(s2);
        
        eql(l.first.super, s2);
        eql(l.first.next.super, s1);
        eql(l.first.next.next.super, s0);
        eql(l.last.super, s0);
        eql(l.last.prev.super, s1);
        eql(l.last.prev.prev.super, s2);
    });
    
    it('position.append', function() {
        var l = new List;
        
        var s0 = new Super;
        
        l.append(s0);
        
        var s1 = new Super;
        
        s0.in(l).append(s1);
        
        eql(l.first.super, s0);
        eql(l.first.next.super, s1);
        eql(l.last.super, s1);
        eql(l.last.prev.super, s0);
        
        var s2 = new Super;
        
        s0.in(l).append(s2);
        
        eql(l.first.super, s0);
        eql(l.first.next.super, s2);
        eql(l.first.next.next.super, s1);
        eql(l.last.super, s1);
        eql(l.last.prev.super, s2);
        eql(l.last.prev.prev.super, s0);
    });
    
    it('position.prepend', function() {
        var l = new List;
        
        var s0 = new Super;
        
        l.prepend(s0);
        
        var s1 = new Super;
        
        s0.in(l).prepend(s1);
        
        eql(l.first.super, s1);
        eql(l.first.next.super, s0);
        eql(l.last.super, s0);
        eql(l.last.prev.super, s1);
        
        var s2 = new Super;
        
        s0.in(l).prepend(s2);
        
        eql(l.first.super, s1);
        eql(l.first.next.super, s2);
        eql(l.first.next.next.super, s0);
        eql(l.last.super, s0);
        eql(l.last.prev.super, s2);
        eql(l.last.prev.prev.super, s1);
    });
    
    it('position.remove', function() {
        var l = new List;
        
        var s0 = new Super;
        var s1 = new Super;
        var s2 = new Super;
        
        l.append(s0, s1, s2);
        
        s1.in(l).remove();
        
        eql(l.first.super, s0);
        eql(l.first.next.super, s2);
        eql(l.last.super, s2);
        eql(l.last.prev.super, s0);
    });
    
    it('list.remove', function() {
        var l = new List;
        
        var s0 = new Super;
        var s1 = new Super;
        var s2 = new Super;
        var s3 = new Super;
        
        l.append(s0, s1, s2, s3);
        
        l.remove(s1, s2);
        
        eql(l.first.super, s0);
        eql(l.first.next.super, s3);
        eql(l.last.super, s3);
        eql(l.last.prev.super, s0);
    });
    
    describe('list.each', function() {
        
        var l = new List;
        
        var s0 = new Super;
        var s1 = new Super;
        var s2 = new Super;
        var s3 = new Super;
        
        l.append(s0, s1, s2, s3);
    
        var Eql = function(now) {
            return function(sup) {
                return now.id == sup.id;
            };
        };
        
        it('default', function(done) {
            var counter = 0;
            l.each(function(sup) {
                var eql = Eql(sup);
                
                if (counter == 0) eql(s0);
                if (counter == 1) eql(s1);
                if (counter == 2) eql(s2);
                if (counter == 3) eql(s3);
                
                counter++;
        
                if (this.next) this.next();
            }, { callback: function() {
                counter.should.be.eql(4);
                done();
            } });
        });
        
        it('sync', function() {
            var counter = 0;
            l.each(function(sup) {
                var eql = Eql(sup);
                
                if (counter == 0) eql(s0);
                if (counter == 1) eql(s1);
                if (counter == 2) eql(s2);
                if (counter == 3) eql(s3);
                
                counter++;
                
            }, { sync: true });
            counter.should.be.eql(4);
        });
        
        it('reverse', function() {
            var counter = 0;
            l.each(function(sup) {
                var eql = Eql(sup);
                
                if (counter == 0) eql(s3);
                if (counter == 1) eql(s2);
                if (counter == 2) eql(s1);
                if (counter == 3) eql(s0);
                
                counter++;
                
                if (this.next) this.next();
            }, { reverse: true });
            
            counter.should.be.eql(4);
        });
        
    });
    
    it('position.travel', function() {
        var l = new List;
        
        var s0 = new Super;
        var s1 = new Super;
        var s2 = new Super;
        
        l.append(s0, s1, s2);
        
        var counter = 0 - 1;
        
        s1.in(l).travel(function(pos) {
            counter++;
            if (counter == 0) {
                eql(pos.super, s1);
                this.next(pos.prev);
            } else if (counter == 1) {
                eql(pos.super, s0);
                this.next(pos.next);
            } else if (counter == 2) {
                eql(pos.super, s1);
                this.next(pos.next);
            } else if (counter == 3) {
                eql(pos.super, s2);
                this.next(pos.prev);
            } else {
                eql(pos.super, s1);
            }
        });
    });
    
    it('list.sort', function(done) {
        var l = new List;
        
        var s0 = new Super;
        var s1 = new Super;
        var s2 = new Super;
        var s3 = new Super;
        
        l.append(s3, s0, s2, s1);
        
        l.sort(function(prev, next) {
            this.next(prev.id < next.id);
        }, function() {
            eql(l.first.super, s0);
            eql(l.first.next.super, s1);
            eql(l.first.next.next.super, s2);
            eql(l.first.next.next.next.super, s3);
            eql(l.last.super, s3);
            eql(l.last.prev.super, s2);
            eql(l.last.prev.prev.super, s1);
            eql(l.last.prev.prev.prev.super, s0);
            
            done();
        });
    });
});