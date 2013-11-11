require('should');
var blackstone = require('../blackstone.js');
var lodash = require('lodash');
var Emitter = blackstone.events.Emitter;
var Handler = blackstone.events.Handler;
var Handlers = blackstone.events.Handlers;
var Superhandler = blackstone.events.Superhandler;

describe('Blackstone Events', function() {
    
    var s1 = new Superhandler;
    
    it('new Handler and superhandler.in', function() {
        var handlers = new Handlers;
        
        s1.in(handlers).should.be.an.instanceof(Handler);
    });
    
    it('superhandler .bind .trigger', function(done) {
        s1.bind(function(next, a, b) {
            a.should.be.true;
            b.should.be.false;
            next();
        }, {});
        
        s1.trigger([true, false], done);
    });
    
    it('superhandler.bind .trigger async', function(done) {
        var temp = false;
        
        s1.bind(function(next, a, b) {
            a.should.be.true;
            b.should.be.false;
            setTimeout(function() {
                temp = true;
                next();
            }, 50);
        }, {});
        
        s1.trigger([true, false], function() {
            temp.should.be.true;
            
            done();
        });
        
        temp.should.be.false;
    });
    
    it('superhandler.bind .trigger sync', function(done) {
        var temp = false;
        
        s1.bind(function(a, b) {
            a.should.be.true;
            b.should.be.false;
            temp = true;
        }, { sync: true });
        
        s1.trigger([true, false], function() {
            temp.should.be.true;
        });
        
        temp.should.be.true;
            
        done();
    });
    
    it('handlers.bind(handler Superhandler)', function() {
        var superhandler = new Superhandler;
        
        var handlers = new Handlers;
        
        handlers.bind(superhandler).should.be.eql(superhandler);
        
        handlers.list.first.superposition.superhandler.should.be.eql(superhandler);
        handlers.list.first.should.be.eql(handlers.list.last);
    });
    
    it('handlers.bind ~ adapter', function() {
        var handlers = new Handlers;
        
        var superhandler = handlers.bind(function(next) {
            next();
        });
        
        handlers.list.first.superposition.superhandler.should.be.eql(superhandler);
        handlers.list.first.should.be.eql(handlers.list.last);
    });
    
    it('handlers.trigger and handlers.unbind', function(done) {
        var handlers = new Handlers;
        
        counter = 0;
        
        var args = [0, 1];
        
        handlers.bind(function(next, a, b) {
            counter = counter+a+b;
            setTimeout(next, 50);
        });
        
        handlers.bind(function(a, b) {
            counter = counter+a+b;
        }, { sync: true });
        
        handlers.bind(function(superposition, next, a, b) {
            counter = counter+a+b;
            superposition.in(handlers).unbind();
            next();
        }, { self: true });
        
        handlers.trigger(args, function() {
            handlers.trigger(args, function() {
                counter.should.be.eql(5);
                done();
            });
        });
    });
    
    it('Emitter', function(done) {
        var emitter = new Emitter;
        
        counter = 0;
        
        var args = [0, 1];
        
        emitter.bind('event', function(next, a, b) {
            counter = counter+a+b;
            setTimeout(next, 50);
        });
        
        emitter.bind('event', function(a, b) {
            counter = counter+a+b;
        }, { sync: true });
        
        emitter.bind('event', function(superposition, next, a, b) {
            counter = counter+a+b;
            superposition.in(emitter.handlers.event).unbind();
            next();
        }, { self: true });
        
        emitter.trigger('event', args, function() {
            emitter.trigger('event', args, function() {
                counter.should.be.eql(5);
                done();
            });
        });
    })
    
});
