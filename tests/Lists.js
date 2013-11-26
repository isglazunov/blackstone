require('should');
var blackstone = require('../blackstone.js');
var _ = require('lodash');
var async = require('async');
var List = blackstone.lists.List;
var Position = blackstone.lists.Position;
var Super = blackstone.lists.Superposition;

describe('Blackstone Lists', function() {
    
    var sEql = function(first, second) {
        first.should.equal(second);
    };
    
    var lEql = function(l, sup) {
        var now = l.first;
        for(var i = 0; i < l.length; i++) {
            sEql(now.super, sup[i]);
            now = now.next;
        }
        var now = l.last;
        for(var i = l.length - 1; i > 0; i--) {
            sEql(now.super, sup[i]);
            now = now.prev;
        }
    };
    
    it('list.append', function() {
        var l = new List;
        
        var s0 = new Super;
        
        l.append(s0);
        
        lEql(l, [s0]);
        
        l.append(s0);
        
        lEql(l, [s0]);
        
        var s1 = new Super;
        
        l.append(s1);
        
        lEql(l, [s0, s1]);
        
        var s2 = new Super;
        
        l.append(s2);
        
        lEql(l, [s0, s1, s2]);
    });
    
    it('list.prepend', function() {
        var l = new List;
        
        var s0 = new Super;
        
        l.prepend(s0);
        
        lEql(l, [s0]);
        
        l.prepend(s0);
        
        lEql(l, [s0]);
        
        var s1 = new Super;
        
        l.prepend(s1);
        
        lEql(l, [s1, s0]);
        
        var s2 = new Super;
        
        l.prepend(s2);
        
        lEql(l, [s2, s1, s0]);
    });
    
    it('position.append', function() {
        var l = new List;
        
        var s0 = new Super;
        
        l.append(s0);
        
        var s1 = new Super;
        
        s0.in(l).append(s1);
        
        lEql(l, [s0, s1]);
        
        var s2 = new Super;
        
        s0.in(l).append(s2);
        
        lEql(l, [s0, s2, s1]);
    });
    
    it('position.prepend', function() {
        var l = new List;
        
        var s0 = new Super;
        
        l.prepend(s0);
        
        var s1 = new Super;
        
        s0.in(l).prepend(s1);
        
        lEql(l, [s1, s0]);
        
        var s2 = new Super;
        
        s0.in(l).prepend(s2);
        
        lEql(l, [s1, s2, s0]);
    });
    
    it('position.remove', function() {
        var l = new List;
        
        var s0 = new Super;
        var s1 = new Super;
        var s2 = new Super;
        
        l.append(s0, s1, s2);
        
        s1.in(l).remove();
        
        lEql(l, [s0, s2]);
    });
    
    it('list.remove', function() {
        var l = new List;
        
        var s0 = new Super;
        var s1 = new Super;
        var s2 = new Super;
        var s3 = new Super;
        
        l.append(s0, s1, s2, s3);
        
        l.remove(s1, s2);
        
        lEql(l, [s0, s3]);
    });
    
    describe('list.each', function() {
        
        var l = new List;
        
        var s0 = new Super;
        var s1 = new Super;
        var s2 = new Super;
        var s3 = new Super;
        
        l.append(s0, s1, s2, s3);
        
        it('default', function(done) {
            var results = [];
            l.each(function(sup) {
                results.push(sup);
                if (this.next) this.next();
            }, { callback: function() {
                results.should.be.eql([s0, s1, s2, s3]);
                done();
            } });
        });
        
        it('sync', function() {
            var results = [];
            l.each(function(sup) {
                results.push(sup);
            }, { sync: true });
            results.should.be.eql([s0, s1, s2, s3]);
        });
        
        it('reverse', function() {
            var results = [];
            l.each(function(sup) {
                results.push(sup);
                if (this.next) this.next();
            }, { reverse: true });
            results.should.be.eql([s3, s2, s1, s0]);
        });
        
    });
    
    it('list.sort', function(done) {
        var l = new List;
        
        var s0 = new Super;
        s0.id = 0;
        var s1 = new Super;
        s1.id = 1;
        var s2 = new Super;
        s2.id = 2;
        var s3 = new Super;
        s3.id = 3;
        
        l.append(s3, s0, s2, s1);
        
        l.sort(function(prev, next) {
            this.next(prev.id < next.id);
        }, function() {
            lEql(l, [s0, s1, s2, s3]);
            
            done();
        });
    });
    
    it('list.add', function(done) {
        var l = new List;
        
        var s0 = new Super;
        s0.id = 0;
        var s1 = new Super;
        s1.id = 1;
        var s2 = new Super;
        s2.id = 2;
        var s3 = new Super;
        s3.id = 3;
        
        var comparator = function(prev, next) {
            this.next(prev.id < next.id);
        };
        
        var series = [];
        
        series.push(function(next) {
            l.add(comparator, s3, function(sup, mov) { next(); });
        });
        
        series.push(function(next) {
            l.add(comparator, s0, function(sup, mov) { next(); });
        });
        
        series.push(function(next) {
            l.add(comparator, s2, function(sup, mov) { next(); });
        });
        
        series.push(function(next) {
            l.add(comparator, s1, function(sup, mov) { next(); });
        });
        
        async.series(series, function() {
            lEql(l, [s0, s1, s2, s3]);
            
            done();
        });
    });
});