require('should');
var blackstone = require('../../blackstone.js');
var lodash = require('lodash');
var List = blackstone.Typing.List;
var Super = blackstone.Typing.Superposition;

describe('Blackstone Typing Lists', function() {
    
    var eql = function(s1, s2) {
        s1._.should.be.eql(s2._);
    }
    
    var create = function(num) {
        var s = Super.new();
        s._ = num;
        return s;
    };
    
    var l1 = List.new();
    
    var s1, s2, s3;
    it('list.append', function(done) {
        s1 = create(1);
        s2 = create(2);
        s3 = create(3);
        
        var appended = false; // true
        
        l1.bind('append', function() {
            appended = true;
        }, { sync: true });
        
        var added = false; // true
        
        l1.bind('add', function() {
            added = true;
        }, { sync: true });
        
        l1.append(s1, s2, s3, function(_s1, _s2, _s3) {
            eql(s1, _s1);
            eql(s2, _s2);
            eql(s3, _s3);
            
            eql(l1.first().super(), s1);
            eql(l1.first().next().super(), s2);
            eql(l1.first().next().next().super(), s3);
            
            eql(l1.last().prev().prev().super(), s1);
            eql(l1.last().prev().super(), s2);
            eql(l1.last().super(), s3);
            
            l1.length().should.be.eql(3);
            
            appended.should.be.true;
            added.should.be.true;
            
            done();
        });
        
        // 1,2,3
    });
    
    var s4, s5, s6;
    it('position.append', function(done) {
        s4 = create(4);
        s5 = create(5);
        s6 = create(6);
        
        var appended = false; // true
        
        s2.in(l1).bind('append', function() {
            appended = true;
        }, { sync: true });
        
        var superAppended = false; // true
        
        s2.bind('append', function() {
            superAppended = true;
        }, { sync: true });
        
        var superAdded = false; // true
        
        s2.bind('add', function() {
            superAdded = true;
        }, { sync: true });
        
        var listAppended = false; // false
        
        l1.bind('append', function() {
            listAppended = true;
        }, { sync: true });
        
        var listAdded = false; // true
        
        l1.bind('add', function() {
            listAdded = true;
        }, { sync: true });
        
        s2.in(l1).append(s4, s5, s6, function(_s4, _s5, _s6) {
            eql(s4, _s4);
            eql(s5, _s5);
            eql(s6, _s6);
            
            eql(l1.first().super(), s1);
            eql(l1.first().next().super(), s2);
            eql(l1.first().next().next().super(), s4);
            eql(l1.first().next().next().next().super(), s5);
            eql(l1.first().next().next().next().next().super(), s6);
            eql(l1.first().next().next().next().next().next().super(), s3);
            eql(l1.last().prev().prev().prev().prev().prev().super(), s1);
            eql(l1.last().prev().prev().prev().prev().super(), s2);
            eql(l1.last().prev().prev().prev().super(), s4);
            eql(l1.last().prev().prev().super(), s5);
            eql(l1.last().prev().super(), s6);
            eql(l1.last().super(), s3);
            
            l1.length().should.be.eql(6);
            
            appended.should.be.true;
            superAppended.should.be.true;
            superAdded.should.be.true;
            listAppended.should.be.false;
            listAdded.should.be.true;
            
            done();
        });
        
        // 1,2,4,5,6,3
    });
    
    it('position.remove', function(done) {
        
        var removed = false; // true
        
        s2.in(l1).bind('remove', function() {
            removed = true;
        }, { sync: true });
        
        var superRemoved = false; // true
        
        s2.bind('remove', function() {
            superRemoved = true;
        }, { sync: true });
        
        var listRemove = false; // true
        
        l1.bind('remove', function() {
            listRemove = true;
        }, { sync: true });
        
        s2.in(l1).remove(function(s2p) {
            eql(l1.first().super(), s1);
            eql(l1.first().next().super(), s4);
            eql(l1.first().next().next().super(), s5);
            eql(l1.first().next().next().next().super(), s6);
            eql(l1.first().next().next().next().next().super(), s3);
            eql(l1.last().prev().prev().prev().prev().super(), s1);
            eql(l1.last().prev().prev().prev().super(), s4);
            eql(l1.last().prev().prev().super(), s5);
            eql(l1.last().prev().super(), s6);
            eql(l1.last().super(), s3);
            
            l1.length().should.be.eql(5);
            
            removed.should.be.true;
            superRemoved.should.be.true;
            listRemove.should.be.true;
            
            done();
        });
        
        // 1,4,5,6,3
    });
    
    it('list.remove', function(done) {
        
        var posRemoved = false; // true
        
        s3.in(l1).bind('remove', function() {
            posRemoved = true;
        }, { sync: true });
        
        var superRemoved = false; // true
        
        s3.bind('remove', function() {
            superRemoved = true;
        }, { sync: true });
        
        var listRemove = 0; // 3
        
        l1.bind('remove', function() {
            listRemove++;
        }, { sync: true });
        
        l1.remove(s6, s3, s4, function() {
        
            eql(l1.first().super(), s1);
            eql(l1.first().next().super(), s5);
            eql(l1.last().prev().super(), s1);
            eql(l1.last().super(), s5);
            
            l1.length().should.be.eql(2);
            
            posRemoved.should.be.true;
            superRemoved.should.be.true;
            listRemove.should.be.eql(3);
            
            done();
        });
        
         // 1,5
    });
    
    it('list.prepend', function(done) {
        
        var posPrepended = false; // true
        
        s1.in(l1).bind('prepend', function() {
            posPrepended = true;
        }, { sync: true });
        
        var supPrepended = false; // true
        
        s1.bind('prepend', function() {
            supPrepended = true;
        }, { sync: true });
        
        var supAdded = false; // true
        
        s1.bind('add', function() {
            supAdded = true;
        }, { sync: true });
        
        var listPrepended = false; // true
        
        l1.bind('prepend', function() {
            listPrepended = true;
        }, { sync: true });
        
        var listAdded = false; // true
        
        l1.bind('add', function() {
            listAdded = true;
        }, { sync: true });
        
        l1.prepend(s6, s4, s2, function() {
        
            eql(l1.first().super(), s6);
            eql(l1.first().next().super(), s4);
            eql(l1.first().next().next().super(), s2);
            eql(l1.first().next().next().next().super(), s1);
            eql(l1.first().next().next().next().next().super(), s5);
            eql(l1.last().prev().prev().prev().prev().super(), s6);
            eql(l1.last().prev().prev().prev().super(), s4);
            eql(l1.last().prev().prev().super(), s2);
            eql(l1.last().prev().super(), s1);
            eql(l1.last().super(), s5);
            
            l1.length().should.be.eql(5);
            
            posPrepended.should.be.true;
            supPrepended.should.be.true;
            supAdded.should.be.true;
            listPrepended.should.be.true;
            listAdded.should.be.true;
            
            done();
        });
        
        // 6,4,2,1,5
    });
    
    var s7, s8;
    it('position.prepend', function() {
        s7 = create(7);
        s8 = create(8);
        s4.in(l1).prepend(s3, s8, s7);
        
        // 6,3,8,7,4,2,1,5
        
        eql(l1.first().super(), s6);
        eql(l1.first().next().super(), s3);
        eql(l1.first().next().next().super(), s8);
        eql(l1.first().next().next().next().super(), s7);
        eql(l1.first().next().next().next().next().super(), s4);
        eql(l1.first().next().next().next().next().next().super(), s2);
        eql(l1.first().next().next().next().next().next().next().super(), s1);
        eql(l1.first().next().next().next().next().next().next().next().super(), s5);
        eql(l1.last().prev().prev().prev().prev().prev().prev().prev().super(), s6);
        eql(l1.last().prev().prev().prev().prev().prev().prev().super(), s3);
        eql(l1.last().prev().prev().prev().prev().prev().super(), s8);
        eql(l1.last().prev().prev().prev().prev().super(), s7);
        eql(l1.last().prev().prev().prev().super(), s4);
        eql(l1.last().prev().prev().super(), s2);
        eql(l1.last().prev().super(), s1);
        eql(l1.last().super(), s5);
        
        l1.length().should.be.eql(8);
    });
    
    var Eql = function(iter, now) {
        return function(sup) {
            eql(now, sup);
        };
    };
    
    it('list.each', function(done) {
        var counter = 0;
        l1.each(function(sup) {
            var eql = Eql(this, sup);
            
            if (counter == 0) eql(s6);
            if (counter == 1) eql(s3);
            if (counter == 2) eql(s8);
            if (counter == 3) eql(s7);
            if (counter == 4) eql(s4);
            if (counter == 5) eql(s2);
            if (counter == 6) eql(s1);
            if (counter == 7) eql(s5);
            
            counter++;
    
            if (this.next) this.next();
        }, { callback: function() {
            counter.should.be.eql(8);
            done();
        } });
    });
    
    it('list.each sync', function() {
        var counter = 0;
        l1.each(function(sup) {
            var eql = Eql(this, sup);
            
            if (counter == 0) eql(s6);
            if (counter == 1) eql(s3);
            if (counter == 2) eql(s8);
            if (counter == 3) eql(s7);
            if (counter == 4) eql(s4);
            if (counter == 5) eql(s2);
            if (counter == 6) eql(s1);
            if (counter == 7) eql(s5);
            
            counter++;
            
        }, { sync: true });
        counter.should.be.eql(8);
    });
    
    it('list.each reverse', function() {
        var counter = 0;
        
        l1.each(function(sup) {
            var eql = Eql(this, sup);
            
            if (counter == 0) eql(s5);
            if (counter == 1) eql(s1);
            if (counter == 2) eql(s2);
            if (counter == 3) eql(s4);
            if (counter == 4) eql(s7);
            if (counter == 5) eql(s8);
            if (counter == 6) eql(s3);
            if (counter == 7) eql(s6);
            
            counter++;
            
            if (this.next) this.next();
        }, { reverse: true });
        
        counter.should.be.eql(8);
    });
});