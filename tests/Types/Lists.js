require('should');
var blackstone = require('../../blackstone.js');
var _ = require('lodash');
var async = require('async');
var List = blackstone.List;
var Super = blackstone.Superposition;

describe('Blackstone Types Lists', function() {
    
    var sEql = function(first, second) {
        (first == second).should.be.true;
    };
    
    var lEql = function(l, sup) {
        var now = l.first();
        for(var i = 0; i < l.length(); i++) {
            sEql(now.super(), sup[i]);
            now = now.next();
        }
        var now = l.last();
        for(var i = l.length() - 1; i > 0; i--) {
            sEql(now.super(), sup[i]);
            now = now.prev();
        }
    };
    
    it('list.append', function(done) {
        var l = List.new();
        
        var s0 = Super.new();
        var s1 = Super.new();
        var s2 = Super.new();
        var s3 = Super.new();
        
        var events = [];
        
        l.bind('add', function() { events.push(1); }, { sync: true });
        l.bind('remove', function() { events.push(2); }, { sync: true });
        
        s0.in(l).bind('add', function() { events.push(3); }, { sync: true });
        s0.bind('add', function(p) { events.push(4); }, { sync: true });
        
        s1.in(l).bind('add', function() { events.push(5); }, { sync: true });
        s1.bind('add', function(p) { events.push(6); }, { sync: true });
        
        s2.in(l).bind('add', function() { events.push(7); }, { sync: true });
        s2.bind('add', function(p) { events.push(8); }, { sync: true });
        
        s3.in(l).bind('add', function() { events.push(9); }, { sync: true });
        s3.bind('add', function(p) { events.push(10); }, { sync: true });
        
        s0.in(l).bind('remove', function() { events.push(11); }, { sync: true });
        s0.bind('remove', function(p) { events.push(12); }, { sync: true });
        
        s1.in(l).bind('remove', function() { events.push(13); }, { sync: true });
        s1.bind('remove', function(p) { events.push(14); }, { sync: true });
        
        s2.in(l).bind('remove', function() { events.push(15); }, { sync: true });
        s2.bind('remove', function(p) { events.push(16); }, { sync: true });
        
        s3.in(l).bind('remove', function() { events.push(17); }, { sync: true });
        s3.bind('remove', function(p) { events.push(18); }, { sync: true });
        
        var series = [];
        
        series.push(function(next) {
            events = [];
            l.append([s0, s1], function() {
                events.should.be.eql([ 3, 4, 5, 6, 1 ]);
                lEql(l, [s0, s1]);
                
                next();
            });
        });
        
        series.push(function(next) {
            events = [];
            l.append([s2, s1], function() {
                events.should.be.eql([ 13, 14, 2, 7, 8, 5, 6, 1 ]);
                lEql(l, [s0, s2, s1]);
                
                next();
            });
        });
        
        series.push(function(next) {
            events = [];
            l.append([s0, s3], function() {
                events.should.be.eql([ 11, 12, 2, 3, 4, 9, 10, 1 ]);
                lEql(l, [s2, s1, s0, s3]);
                
                next();
            });
        });
        
        async.series(series, done);
        
    });
    
    it('list.prepend', function(done) {
        var l = List.new();
        
        var s0 = Super.new();
        var s1 = Super.new();
        var s2 = Super.new();
        var s3 = Super.new();
        
        var events = [];
        
        l.bind('add', function() { events.push(1); }, { sync: true });
        l.bind('remove', function() { events.push(2); }, { sync: true });
        
        s0.in(l).bind('add', function() { events.push(3); }, { sync: true });
        s0.bind('add', function(p) { events.push(4); }, { sync: true });
        
        s1.in(l).bind('add', function() { events.push(5); }, { sync: true });
        s1.bind('add', function(p) { events.push(6); }, { sync: true });
        
        s2.in(l).bind('add', function() { events.push(7); }, { sync: true });
        s2.bind('add', function(p) { events.push(8); }, { sync: true });
        
        s3.in(l).bind('add', function() { events.push(9); }, { sync: true });
        s3.bind('add', function(p) { events.push(10); }, { sync: true });
        
        s0.in(l).bind('remove', function() { events.push(11); }, { sync: true });
        s0.bind('remove', function(p) { events.push(12); }, { sync: true });
        
        s1.in(l).bind('remove', function() { events.push(13); }, { sync: true });
        s1.bind('remove', function(p) { events.push(14); }, { sync: true });
        
        s2.in(l).bind('remove', function() { events.push(15); }, { sync: true });
        s2.bind('remove', function(p) { events.push(16); }, { sync: true });
        
        s3.in(l).bind('remove', function() { events.push(17); }, { sync: true });
        s3.bind('remove', function(p) { events.push(18); }, { sync: true });
        
        var series = [];
        
        series.push(function(next) {
            events = [];
            l.prepend([s0, s1], function() {
                events.should.be.eql([ 3, 4, 5, 6, 1 ]);
                lEql(l, [s0, s1]);
                
                next();
            });
        });
        
        series.push(function(next) {
            events = [];
            l.prepend([s2, s1], function() {
                events.should.be.eql([ 13, 14, 2, 7, 8, 5, 6, 1 ]);
                lEql(l, [s2, s1, s0]);
                
                next();
            });
        });
        
        series.push(function(next) {
            events = [];
            l.prepend([s0, s3], function() {
                events.should.be.eql([ 11, 12, 2, 3, 4, 9, 10, 1 ]);
                lEql(l, [s0, s3, s2, s1]);
                
                next();
            });
        });
        
        async.series(series, done);
        
    });
    
    it('position.append', function(done) {
        var l = List.new();
        
        var s0 = Super.new();
        var s1 = Super.new();
        var s2 = Super.new();
        var s3 = Super.new();
        
        var events = [];
        
        l.bind('add', function() { events.push(1); }, { sync: true });
        l.bind('remove', function() { events.push(2); }, { sync: true });
        
        s0.in(l).bind('add', function() { events.push(3); }, { sync: true });
        s0.bind('add', function(p) { events.push(4); }, { sync: true });
        
        s1.in(l).bind('add', function() { events.push(5); }, { sync: true });
        s1.bind('add', function(p) { events.push(6); }, { sync: true });
        
        s2.in(l).bind('add', function() { events.push(7); }, { sync: true });
        s2.bind('add', function(p) { events.push(8); }, { sync: true });
        
        s3.in(l).bind('add', function() { events.push(9); }, { sync: true });
        s3.bind('add', function(p) { events.push(10); }, { sync: true });
        
        s0.in(l).bind('remove', function() { events.push(11); }, { sync: true });
        s0.bind('remove', function(p) { events.push(12); }, { sync: true });
        
        s1.in(l).bind('remove', function() { events.push(13); }, { sync: true });
        s1.bind('remove', function(p) { events.push(14); }, { sync: true });
        
        s2.in(l).bind('remove', function() { events.push(15); }, { sync: true });
        s2.bind('remove', function(p) { events.push(16); }, { sync: true });
        
        s3.in(l).bind('remove', function() { events.push(17); }, { sync: true });
        s3.bind('remove', function(p) { events.push(18); }, { sync: true });
        
        var series = [];
        
        series.push(function(next) {
            events = [];
            l.append([s0, s1], function() {
                events.should.be.eql([ 3, 4, 5, 6, 1 ]);
                lEql(l, [s0, s1]);
                
                next();
            });
        });
        
        series.push(function(next) {
            events = [];
            s0.in(l).append([s2, s1], function() {
                events.should.be.eql([ 13, 14, 2, 7, 8, 5, 6, 1 ]);
                lEql(l, [s0, s2, s1]);
                
                next();
            });
        });
        
        series.push(function(next) {
            events = [];
            s2.in(l).append([s3, s1], function() {
                events.should.be.eql([ 13, 14, 2, 9, 10, 5, 6, 1 ]);
                lEql(l, [s0, s2, s3, s1]);
                
                next();
            });
        });
        
        async.series(series, done);
        
    });
    
    it('position.prepend', function(done) {
        var l = List.new();
        
        var s0 = Super.new();
        var s1 = Super.new();
        var s2 = Super.new();
        var s3 = Super.new();
        
        var events = [];
        
        l.bind('add', function() { events.push(1); }, { sync: true });
        l.bind('remove', function() { events.push(2); }, { sync: true });
        
        s0.in(l).bind('add', function() { events.push(3); }, { sync: true });
        s0.bind('add', function(p) { events.push(4); }, { sync: true });
        
        s1.in(l).bind('add', function() { events.push(5); }, { sync: true });
        s1.bind('add', function(p) { events.push(6); }, { sync: true });
        
        s2.in(l).bind('add', function() { events.push(7); }, { sync: true });
        s2.bind('add', function(p) { events.push(8); }, { sync: true });
        
        s3.in(l).bind('add', function() { events.push(9); }, { sync: true });
        s3.bind('add', function(p) { events.push(10); }, { sync: true });
        
        s0.in(l).bind('remove', function() { events.push(11); }, { sync: true });
        s0.bind('remove', function(p) { events.push(12); }, { sync: true });
        
        s1.in(l).bind('remove', function() { events.push(13); }, { sync: true });
        s1.bind('remove', function(p) { events.push(14); }, { sync: true });
        
        s2.in(l).bind('remove', function() { events.push(15); }, { sync: true });
        s2.bind('remove', function(p) { events.push(16); }, { sync: true });
        
        s3.in(l).bind('remove', function() { events.push(17); }, { sync: true });
        s3.bind('remove', function(p) { events.push(18); }, { sync: true });
        
        var series = [];
        
        series.push(function(next) {
            events = [];
            l.append([s0, s1], function() {
                events.should.be.eql([ 3, 4, 5, 6, 1 ]);
                lEql(l, [s0, s1]);
                
                next();
            });
        });
        
        series.push(function(next) {
            events = [];
            s0.in(l).prepend([s2, s1], function() {
                events.should.be.eql([ 13, 14, 2, 7, 8, 5, 6, 1 ]);
                lEql(l, [s2, s1, s0]);
                
                next();
            });
        });
        
        series.push(function(next) {
            events = [];
            s0.in(l).prepend([s3, s1], function() {
                events.should.be.eql([ 13, 14, 2, 9, 10, 5, 6, 1 ]);
                lEql(l, [s2, s3, s1, s0]);
                
                next();
            });
        });
        
        async.series(series, done);
        
    });
    
    it('list.remove', function(done) {
        var l = List.new();
        
        var s0 = Super.new();
        var s1 = Super.new();
        var s2 = Super.new();
        var s3 = Super.new();
        
        var events = [];
        
        l.bind('add', function() { events.push(1); }, { sync: true });
        l.bind('remove', function() { events.push(2); }, { sync: true });
        
        s0.in(l).bind('add', function() { events.push(3); }, { sync: true });
        s0.bind('add', function(p) { events.push(4); }, { sync: true });
        
        s1.in(l).bind('add', function() { events.push(5); }, { sync: true });
        s1.bind('add', function(p) { events.push(6); }, { sync: true });
        
        s2.in(l).bind('add', function() { events.push(7); }, { sync: true });
        s2.bind('add', function(p) { events.push(8); }, { sync: true });
        
        s3.in(l).bind('add', function() { events.push(9); }, { sync: true });
        s3.bind('add', function(p) { events.push(10); }, { sync: true });
        
        s0.in(l).bind('remove', function() { events.push(11); }, { sync: true });
        s0.bind('remove', function(p) { events.push(12); }, { sync: true });
        
        s1.in(l).bind('remove', function() { events.push(13); }, { sync: true });
        s1.bind('remove', function(p) { events.push(14); }, { sync: true });
        
        s2.in(l).bind('remove', function() { events.push(15); }, { sync: true });
        s2.bind('remove', function(p) { events.push(16); }, { sync: true });
        
        s3.in(l).bind('remove', function() { events.push(17); }, { sync: true });
        s3.bind('remove', function(p) { events.push(18); }, { sync: true });
        
        var series = [];
        
        series.push(function(next) {
            l.prepend([s0, s1, s3, s2], function() {
                next();
            });
        });
        
        series.push(function(next) {
            events = [];
            l.remove([s2, s0], function() {
                events.should.be.eql([ 15, 16, 11, 12, 2 ]);
                lEql(l, [s1, s3]);
                
                next();
            });
        });
        
        async.series(series, done);
        
    });
    
    it('position.remove', function(done) {
        var l = List.new();
        
        var s0 = Super.new();
        var s1 = Super.new();
        var s2 = Super.new();
        var s3 = Super.new();
        
        var events = [];
        
        l.bind('add', function() { events.push(1); }, { sync: true });
        l.bind('remove', function() { events.push(2); }, { sync: true });
        
        s0.in(l).bind('add', function() { events.push(3); }, { sync: true });
        s0.bind('add', function(p) { events.push(4); }, { sync: true });
        
        s1.in(l).bind('add', function() { events.push(5); }, { sync: true });
        s1.bind('add', function(p) { events.push(6); }, { sync: true });
        
        s2.in(l).bind('add', function() { events.push(7); }, { sync: true });
        s2.bind('add', function(p) { events.push(8); }, { sync: true });
        
        s3.in(l).bind('add', function() { events.push(9); }, { sync: true });
        s3.bind('add', function(p) { events.push(10); }, { sync: true });
        
        s0.in(l).bind('remove', function() { events.push(11); }, { sync: true });
        s0.bind('remove', function(p) { events.push(12); }, { sync: true });
        
        s1.in(l).bind('remove', function() { events.push(13); }, { sync: true });
        s1.bind('remove', function(p) { events.push(14); }, { sync: true });
        
        s2.in(l).bind('remove', function() { events.push(15); }, { sync: true });
        s2.bind('remove', function(p) { events.push(16); }, { sync: true });
        
        s3.in(l).bind('remove', function() { events.push(17); }, { sync: true });
        s3.bind('remove', function(p) { events.push(18); }, { sync: true });
        
        var series = [];
        
        series.push(function(next) {
            l.prepend([s0, s1, s3, s2], function() {
                next();
            });
        });
        
        series.push(function(next) {
            events = [];
            s1.in(l).remove(function() {
                events.should.be.eql([ 13, 14, 2 ]);
                lEql(l, [s0, s3, s2]);
                
                next();
            });
        });
        
        async.series(series, done);
        
    });
    
    it('position.travel', function() {
        var l = List.new();
        
        var s0 = Super.new();
        var s1 = Super.new();
        var s2 = Super.new();
        
        l.append([s0, s1, s2]);
        
        var counter = 0 - 1;
        var results = [];
        s1.in(l).travel(function(pos) {
            results.push(pos.super());
            
            counter++;
            if (counter == 0) this.next(pos.prev());
            else if (counter == 1) this.next(pos.next());
            else if (counter == 2) this.next(pos.next());
            else if (counter == 3) this.next(pos.prev());
        });
        
        results.should.be.eql([s1, s0, s1, s2, s1]);
    });
    
    it('list.sort', function(done) {
        var l = List.new();
        
        l.comparator = function(prev, next) {
            this.next(prev.id < next.id);
        };
        
        var s0 = Super.new();
        s0.id = 0;
        var s1 = Super.new();
        s1.id = 1;
        var s2 = Super.new();
        s2.id = 2;
        var s3 = Super.new();
        s3.id = 3;
        
        var events = [];
        
        l.bind('sort', function() { events.push(1); }, { sync: true });
        
        var series = [];
        
        series.push(function(next) {
            events = [];
            l.append([s1, s0, s3, s2], function() {
                l.sort(function() {
                    events.should.be.eql([ 1 ]);
                    lEql(l, [s0, s1, s2, s3]);
                    
                    next();
                })
            });
        });
        
        async.series(series, done);
        
    });
    
    describe('list.each', function() {
        var l = List.new();
        
        var s0 = Super.new();
        var s1 = Super.new();
        var s2 = Super.new();
        var s3 = Super.new();
        
        l.append([s0, s1, s2, s3]);
        
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
    
    it('list.add', function(done) {
        var l = List.new();
        
        l.comparator = function(prev, next) {
            this.next(prev.id < next.id);
        };
        
        var s0 = Super.new();
        s0.id = 0;
        var s1 = Super.new();
        s1.id = 1;
        var s2 = Super.new();
        s2.id = 2;
        var s3 = Super.new();
        s3.id = 3;
        
        var events = [];
        
        l.bind('add', function() { events.push(1); }, { sync: true });
        l.bind('remove', function() { events.push(2); }, { sync: true });
        
        s0.in(l).bind('add', function() { events.push(3); }, { sync: true });
        s0.bind('add', function(p) { events.push(4); }, { sync: true });
        
        s1.in(l).bind('add', function() { events.push(5); }, { sync: true });
        s1.bind('add', function(p) { events.push(6); }, { sync: true });
        
        s2.in(l).bind('add', function() { events.push(7); }, { sync: true });
        s2.bind('add', function(p) { events.push(8); }, { sync: true });
        
        s3.in(l).bind('add', function() { events.push(9); }, { sync: true });
        s3.bind('add', function(p) { events.push(10); }, { sync: true });
        
        s0.in(l).bind('remove', function() { events.push(11); }, { sync: true });
        s0.bind('remove', function(p) { events.push(12); }, { sync: true });
        
        s1.in(l).bind('remove', function() { events.push(13); }, { sync: true });
        s1.bind('remove', function(p) { events.push(14); }, { sync: true });
        
        s2.in(l).bind('remove', function() { events.push(15); }, { sync: true });
        s2.bind('remove', function(p) { events.push(16); }, { sync: true });
        
        s3.in(l).bind('remove', function() { events.push(17); }, { sync: true });
        s3.bind('remove', function(p) { events.push(18); }, { sync: true });
        
        var series = [];
        
        series.push(function(next) {
            events = [];
            l.add([s1, s0, s3, s2], function() {
                events.should.be.eql([ 5, 6, 3, 4, 9, 10, 7, 8, 1 ]);
                lEql(l, [s0, s1, s2, s3]);
                
                next();
            });
        });
        
        async.series(series, done);
        
    });
});