require('should');
var blackstone = require('../blackstone.js');
var lodash = require('lodash');
var Type = blackstone.typing.Type;
var Item = blackstone.typing.Item;

describe('Blackstone Typing', function() {
    
    it('typing', function() {
        var A = Type.inherit();
        
        A.constructor = function() {
            this._a = 1;
        };
        
        var a = A.new();
        
        a._a.should.be.eql(1);
    });
    
    it('multiple inheritance', function() {
        var A = Type.inherit();
        
        A.constructor = function() {
            this._a = 1;
        };
        
        var B = new Type;
        
        B.prototype._b = 2;
        
        var C = Type.inherit();
        
        C.types.include(A, B);
        
        C.constructor = function() {
            this._c = 3;
        };
        
        var c = C.new();
        
        c._a.should.be.eql(1);
        c._b.should.be.eql(2);
        c._c.should.be.eql(3);
        c.of(A, B, C).should.be.true;
        
        var a = A.new();
        a.of(C).should.be.false;
    });
    
    it('many event emitters', function() {
        var A = Type.inherit();
        
        var B = Type.inherit();
        
        var results = [];
        
        A.bind('event', function(next) {
            results.push('A');
            next();
        });
        
        B.bind('event', function(next) {
            results.push('B');
            next();
        });
        
        A.trigger('event', [], function() {
            results.should.be.eql(['A']);
        });
        
        B.trigger('event', [], function() {
            results.should.be.eql(['A','B']);
        });
        
        A.trigger('event', [], function() {
            results.should.be.eql(['A','B','A']);
        });
        
        B.trigger('event', [], function() {
            results.should.be.eql(['A','B','A','B']);
        });
    });
    
});
