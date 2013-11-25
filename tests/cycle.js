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
    
    it('Array !reverse', function(done) {
        
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
    
    it('Object !reverse', function(done) {
        
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
    
    it('Array reverse', function(done) {
        
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
    
    it('Object reverse', function(done) {
        
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
    
    it('Array sync', function(done) {
        
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
    
    it('Object sync', function(done) {
        
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
    
});
