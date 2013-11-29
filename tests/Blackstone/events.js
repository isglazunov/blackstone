require('should');
var blackstone = require('../../blackstone.js');

describe('events', function() {
    
    var emitter;
    
    it('Emitter', function() {
        emitter = new blackstone.events.Emitter;
    });
    
    it('Event Handler', function() {
        
        var results = [];
        
        emitter.on('run').bind(function() {
            results.push('bind');
        });
        
        emitter.on('run').after(function() {
            results.push('after');
        });
        
        emitter.on('run').before(function() {
            results.push('before');
        });
        
        emitter.on('run').trigger();
        
        results.should.be.eql(['before','bind','after']);
        
    });
    
    it('Position Handler', function() {
        
        var results = [];
        
        var handler = emitter.on('run').bind(function() {
            results.push('bind');
        });
        
        handler.in(emitter).after(function() {
            results.push('after');
        });
        
        handler.in(emitter).before(function() {
            results.push('before');
        });
        
        emitter.on('run').trigger();
        
        results.should.be.eql(['before','bind','after']);
        
    });
    
});