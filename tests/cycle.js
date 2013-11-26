require('should');
var blackstone = require('../blackstone.js');
var lodash = require('lodash');
var cycle = blackstone.cycle;

describe('cycle', function() {
    
    it('Function', function(done) {
        
        var i = 0;
        var h = 0;
        
        cycle(function() {
            i++;
            this.next( i < 101 );
        }, function() {
            h++;
            this.next();
        }, { callback: function() {
            
            i.should.be.equal(101);
            h.should.be.equal(100);
            
            done();
            
        } });
        
    });
    
    describe('Object', function() {
        
        it('default', function(done) {
            
            var object = {};
            
            for (var a = 0; a < 101; a++) {
                object[a] = a;
            }
            
            var i = 0;
            
            cycle(object, function(value, key) {
                
                i++;
                value.should.equal(i);
                this.next();
                
            }, { callback: function() {
                
                i.should.be.equal(100);
                
                done();
                
            } });
            
        });
        
        it('sync', function(done) {
            
            var object = {};
            
            for (var a = 0; a < 101; a++) {
                object[a] = a;
            }
            
            var i = 0;
            
            cycle(object, function(value, key) {
                
                i++;
                value.should.equal(i);
                
            }, { callback: function() {
                
                i.should.be.equal(100);
                
                done();
                
            }, sync: true });
            
        });
        
        it('reverse', function(done) {
            
            var object = {};
            
            for (var a = 0; a < 101; a++) {
                object[a] = a;
            }
            
            var i = 100;
            
            cycle(object, function(value, key) {
                
                i--;
                value.should.equal(i);
                this.next();
                
            }, { callback: function() {
                
                i.should.be.equal(0);
                
                done();
                
            }, reverse: true });
            
        });
    });
    
    describe('Array', function() {
        
        it('default', function(done) {
           
            var array = [];
            
            for (var a = 0; a < 101; a++) {
                array[a] = a;
            }
            
            var i = 0;
            
            cycle(array, function(value, key) {
                
                i++;
                value.should.equal(i);
                this.next();
                
            }, { callback: function() {
                
                i.should.be.equal(100);
                
                done();
                
            } }); 
        });
        
        it('sync', function(done) {
            
            var array = [];
            
            for (var a = 0; a < 101; a++) {
                array[a] = a;
            }
            
            var i = 0;
            
            cycle(array, function(value, key) {
                
                i++;
                value.should.equal(i);
                
            }, { callback: function() {
                
                i.should.be.equal(100);
                
                done();
                
            }, sync: true });
            
        });
        
        it('reverse', function(done) {
            
            var array = [];
            
            for (var a = 0; a < 101; a++) {
                array[a] = a;
            }
            
            var i = 100;
            
            cycle(array, function(value, key) {
                
                i--;
                value.should.equal(i);
                this.next();
                
            }, { callback: function() {
                
                i.should.be.equal(0);
                
                done();
                
            }, reverse: true });
            
        });
        
    });
    
    describe('Object List', function() {
        
        var l = new blackstone.lists.List;
        
        var s0 = new blackstone.lists.Superposition;
        var s1 = new blackstone.lists.Superposition;
        var s2 = new blackstone.lists.Superposition;
        var s3 = new blackstone.lists.Superposition;
        
        l.append(s0, s1, s2, s3);
        
        it('default', function(done) {
            var results = [];
            
            cycle(l, function(sup) {
                results.push(sup);
                if (this.next) this.next();
            }, { callback: function() {
                results.should.be.eql([s0, s1, s2, s3]);
                done();
            } });
        });
        
        it('sync', function() {
            var results = [];
            cycle(l, function(sup) {
                results.push(sup);
            }, { sync: true });
            results.should.be.eql([s0, s1, s2, s3]);
        });
        
        it('reverse', function() {
            var results = [];
            cycle(l, function(sup) {
                results.push(sup);
                if (this.next) this.next();
            }, { reverse: true });
            results.should.be.eql([s3, s2, s1, s0]);
        });
        
    });
    
    describe('Object Item:List', function() {
        var l = blackstone.List.new();
        
        var s0 = blackstone.Superposition.new();
        var s1 = blackstone.Superposition.new();
        var s2 = blackstone.Superposition.new();
        var s3 = blackstone.Superposition.new();
        
        l.append([s0, s1, s2, s3]);
        
        it('default', function(done) {
            var results = [];
            cycle(l, function(sup) {
                results.push(sup);
                if (this.next) this.next();
            }, { callback: function() {
                results.should.be.eql([s0, s1, s2, s3]);
                done();
            } });
        });
        
        it('sync', function() {
            var results = [];
            cycle(l, function(sup) {
                results.push(sup);
            }, { sync: true });
            results.should.be.eql([s0, s1, s2, s3]);
        });
        
        it('reverse', function() {
            var results = [];
            cycle(l, function(sup) {
                results.push(sup);
                if (this.next) this.next();
            }, { reverse: true });
            results.should.be.eql([s3, s2, s1, s0]);
        });
        
    });
    
});
