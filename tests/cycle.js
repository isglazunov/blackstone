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
            this.next( i < 11 );
        }, function() {
            h++;
            this.next();
        }, { callback: function() {
            
            i.should.be.equal(11);
            h.should.be.equal(10);
            
            done();
            
        } });
        
    });
    
    describe('Object', function() {
        
        it('default', function(done) {
            
            var object = { 0:0, 1:1, 2:2, 3:3, 4:4 };
            var result = {};
            
            cycle(object, function(value, key) {
                
                result[key] = value;
                this.next();
                
            }, { callback: function() {
                
                result.should.be.eql(object);
                
                done();
                
            } });
            
        });
        
        it('sync', function(done) {
            
            var object = { 0:0, 1:1, 2:2, 3:3, 4:4 };
            var result = {};
            
            cycle(object, function(value, key) {
                
                result[key] = value;
                
            }, { callback: function() {
                
                result.should.be.eql(object);
                
                done();
                
            }, sync: true });
            
        });
        
        it('reverse', function(done) {
            
            var object = { 0:0, 1:1, 2:2, 3:3, 4:4 };
            var result = {};
            
            cycle(object, function(value, key) {
                
                result[key] = value;
                this.next();
                
            }, { callback: function() {
                
                result.should.be.eql(object);
                
                done();
                
            }, reverse: true });
            
        });
    });
    
    describe('Array', function() {
        
        it('default', function(done) {
           
            var array = [0,1,2,3,4,5,6,7,8,9,10];
            
            var result = [];
            
            cycle(array, function(value, key) {
                
                result.push(value);
                this.next();
                
            }, { callback: function() {
                
                result.should.be.eql(array);
                
                done();
                
            } });
        });
        
        it('sync', function(done) {
           
            var array = [0,1,2,3,4,5,6,7,8,9,10];
            
            var result = [];
            
            cycle(array, function(value, key) {
                
                result.push(value);
                
            }, { callback: function() {
                
                result.should.be.eql(array);
                
                done();
                
            }, sync: true });
            
        });
        
        it('reverse', function(done) {
           
            var array = [0,1,2,3,4,5,6,7,8,9,10];
            var target = [10,9,8,7,6,5,4,3,2,1,0];
            var result = [];
            
            cycle(array, function(value, key) {
                
                result.push(value);
                this.next();
                
            }, { callback: function() {
                
                result.should.be.eql(target);
                
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
