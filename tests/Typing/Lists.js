require('should');
var blackstone = require('../../blackstone.js');
var _ = require('lodash');
var List = blackstone.Typing.List;
var Super = blackstone.Typing.Superposition;

describe('Blackstone Lists', function() {
    
    var eql = function(first, second) {
        first.__native.id.should.be.eql(second.__native.id);
    };
    
    it('list.append', function() {
        var l = List.new();
        
        var s0 = Super.new();
        
        l.append(s0);
        
        eql(l.first().super(), s0);
        _.isUndefined(l.first().next()).should.be.true;
        eql(l.last().super(), s0);
        _.isUndefined(l.last().prev()).should.be.true;
        
        l.append(s0);
        
        eql(l.first().super(), s0);
        _.isUndefined(l.first().next()).should.be.true;
        eql(l.last().super(), s0);
        _.isUndefined(l.last().prev()).should.be.true;
        
        var s1 = Super.new();
        
        l.append(s1);
        
        eql(l.first().super(), s0);
        eql(l.first().next().super(), s1);
        eql(l.last().super(), s1);
        eql(l.last().prev().super(), s0);
        
        var s2 = Super.new();
        
        l.append(s2);
        
        eql(l.first().super(), s0);
        eql(l.first().next().super(), s1);
        eql(l.first().next().next().super(), s2);
        eql(l.last().super(), s2);
        eql(l.last().prev().super(), s1);
        eql(l.last().prev().prev().super(), s0);
    });
    
    it('list.prepend', function() {
        var l = List.new();
        
        var s0 = Super.new();
        
        l.prepend(s0);
        
        eql(l.first().super(), s0);
        _.isUndefined(l.first().next()).should.be.true;
        eql(l.last().super(), s0);
        _.isUndefined(l.last().prev()).should.be.true;
        
        l.prepend(s0);
        
        eql(l.first().super(), s0);
        _.isUndefined(l.first().next()).should.be.true;
        eql(l.last().super(), s0);
        _.isUndefined(l.last().prev()).should.be.true;
        
        var s1 = Super.new();
        
        l.prepend(s1);
        
        eql(l.first().super(), s1);
        eql(l.first().next().super(), s0);
        eql(l.last().super(), s0);
        eql(l.last().prev().super(), s1);
        
        var s2 = Super.new();
        
        l.prepend(s2);
        
        eql(l.first().super(), s2);
        eql(l.first().next().super(), s1);
        eql(l.first().next().next().super(), s0);
        eql(l.last().super(), s0);
        eql(l.last().prev().super(), s1);
        eql(l.last().prev().prev().super(), s2);
    });
    
    it('position.append', function() {
        var l = List.new();
        
        var s0 = Super.new();
        
        l.append(s0);
        
        var s1 = Super.new();
        
        s0.in(l).append(s1);
        
        eql(l.first().super(), s0);
        eql(l.first().next().super(), s1);
        eql(l.last().super(), s1);
        eql(l.last().prev().super(), s0);
        
        var s2 = Super.new();
        
        s0.in(l).append(s2);
        
        eql(l.first().super(), s0);
        eql(l.first().next().super(), s2);
        eql(l.first().next().next().super(), s1);
        eql(l.last().super(), s1);
        eql(l.last().prev().super(), s2);
        eql(l.last().prev().prev().super(), s0);
    });
    
    it('position.prepend', function() {
        var l = List.new();
        
        var s0 = Super.new();
        
        l.prepend(s0);
        
        var s1 = Super.new();
        
        s0.in(l).prepend(s1);
        
        eql(l.first().super(), s1);
        eql(l.first().next().super(), s0);
        eql(l.last().super(), s0);
        eql(l.last().prev().super(), s1);
        
        var s2 = Super.new();
        
        s0.in(l).prepend(s2);
        
        eql(l.first().super(), s1);
        eql(l.first().next().super(), s2);
        eql(l.first().next().next().super(), s0);
        eql(l.last().super(), s0);
        eql(l.last().prev().super(), s2);
        eql(l.last().prev().prev().super(), s1);
    });
    
    it('position.remove', function() {
        var l = List.new();
        
        var s0 = Super.new();
        var s1 = Super.new();
        var s2 = Super.new();
        
        l.append(s0, s1, s2);
        
        s1.in(l).remove();
        
        eql(l.first().super(), s0);
        eql(l.first().next().super(), s2);
        eql(l.last().super(), s2);
        eql(l.last().prev().super(), s0);
    });
    
    it('list.remove', function() {
        var l = List.new();
        
        var s0 = Super.new();
        var s1 = Super.new();
        var s2 = Super.new();
        var s3 = Super.new();
        
        l.append(s0, s1, s2, s3);
        
        l.remove(s1, s2);
        
        eql(l.first().super(), s0);
        eql(l.first().next().super(), s3);
        eql(l.last().super(), s3);
        eql(l.last().prev().super(), s0);
    });
    
    describe('list.each', function() {
        
        var l = List.new();
        
        var s0 = Super.new();
        var s1 = Super.new();
        var s2 = Super.new();
        var s3 = Super.new();
        
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
        
                if (this.next()) this.next()();
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
                
                if (this.next()) this.next()();
            }, { reverse: true });
            
            counter.should.be.eql(4);
        });
        
    });
    
    it('position.before', function() {
        var l = List.new();
        
        var s0 = Super.new();
        var s1 = Super.new();
        var s2 = Super.new();
        
        l.append(s0, s1, s2);
        
        s2.in(l).before(s0);
        
        eql(l.first().super(), s2);
        eql(l.first().next().super(), s0);
        eql(l.first().next().next().super(), s1);
        eql(l.last().super(), s1);
        eql(l.last().prev().super(), s0);
        eql(l.last().prev().prev().super(), s2);
        
        var s3 = Super.new();
        
        s3.in(l).before(s2);
        
        eql(l.first().super(), s3);
        eql(l.first().next().super(), s2);
        eql(l.first().next().next().super(), s0);
        eql(l.first().next().next().next().super(), s1);
        eql(l.last().super(), s1);
        eql(l.last().prev().super(), s0);
        eql(l.last().prev().prev().super(), s2);
        eql(l.last().prev().prev().prev().super(), s3);
    });
    
    it('position.after', function() {
        var l = List.new();
        
        var s0 = Super.new();
        var s1 = Super.new();
        var s2 = Super.new();
        
        l.append(s0, s1, s2);
        
        s2.in(l).after(s0);
        
        eql(l.first().super(), s0);
        eql(l.first().next().super(), s2);
        eql(l.first().next().next().super(), s1);
        eql(l.last().super(), s1);
        eql(l.last().prev().super(), s2);
        eql(l.last().prev().prev().super(), s0);
        
        var s3 = Super.new();
        
        s3.in(l).after(s2);
        
        eql(l.first().super(), s0);
        eql(l.first().next().super(), s2);
        eql(l.first().next().next().super(), s3);
        eql(l.first().next().next().next().super(), s1);
        eql(l.last().super(), s1);
        eql(l.last().prev().super(), s3);
        eql(l.last().prev().prev().super(), s2);
        eql(l.last().prev().prev().prev().super(), s0);
    });
    
    it('position.before', function() {
        var l = List.new();
        
        var s0 = Super.new();
        var s1 = Super.new();
        var s2 = Super.new();
        
        l.append(s0, s1, s2);
        
        s0.in(l).before(s0);
        
        eql(l.first().super(), s0);
        eql(l.first().next().super(), s1);
        eql(l.first().next().next().super(), s2);
        eql(l.last().super(), s2);
        eql(l.last().prev().super(), s1);
        eql(l.last().prev().prev().super(), s0);
    });
    
    it('position.after', function() {
        var l = List.new();
        
        var s0 = Super.new();
        var s1 = Super.new();
        var s2 = Super.new();
        
        l.append(s0, s1, s2);
        
        s0.in(l).after(s0);
        
        eql(l.first().super(), s0);
        eql(l.first().next().super(), s1);
        eql(l.first().next().next().super(), s2);
        eql(l.last().super(), s2);
        eql(l.last().prev().super(), s1);
        eql(l.last().prev().prev().super(), s0);
    });
    
    it('position.travel', function() {
        var l = List.new();
        
        var s0 = Super.new();
        var s1 = Super.new();
        var s2 = Super.new();
        
        l.append(s0, s1, s2);
        
        var counter = 0 - 1;
        
        s1.in(l).travel(function(pos) {
            counter++;
            if (counter == 0) {
                eql(pos.super(), s1);
                this.next(pos.prev());
            } else if (counter == 1) {
                eql(pos.super(), s0);
                this.next(pos.next());
            } else if (counter == 2) {
                eql(pos.super(), s1);
                this.next(pos.next());
            } else if (counter == 3) {
                eql(pos.super(), s2);
                this.next(pos.prev());
            } else {
                eql(pos.super(), s1);
            }
        });
    });
    
    it('list.sort', function(done) {
        var l = List.new();
        
        var s0 = Super.new();
        var s1 = Super.new();
        var s2 = Super.new();
        var s3 = Super.new();
        
        l.append(s3, s0, s2, s1);
        
        l.comparator = function(prev, next) {
            this.next(prev.__native.id < next.__native.id);
        };
        
        l.bind('sort', function() {
            eql(l.first().super(), s0);
            eql(l.first().next().super(), s1);
            eql(l.first().next().next().super(), s2);
            eql(l.first().next().next().next().super(), s3);
            eql(l.last().super(), s3);
            eql(l.last().prev().super(), s2);
            eql(l.last().prev().prev().super(), s1);
            eql(l.last().prev().prev().prev().super(), s0);
            
            this.next();
        });
        
        l.sort(function() {
            done();
        });
    });
});