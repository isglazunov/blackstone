require('should');
var blackstone = require('../blackstone.js');
var lodash = require('lodash');
var Type = blackstone.typing.Type;
var Item = blackstone.typing.Item;

describe('Blackstone Typing', function() {
    
    it('new', function() {
        
        var A = Type.inherit();
        
        A.prototype.__a = true;
        
        A.constructor = function(arg) {
            this._a = arg;
        };
        
        var a = A.new(true);
        
        a.__a.should.be.true;
        a._a.should.be.true;
        
    });
    
    it('prototypes with item', function() {
        
        var A = Type.inherit();
        
        A.prototype.__a = true;
        
        A.constructor = function(arg) {
            this._a = arg;
        };
        
        var B = Type.inherit();
        
        B.prototype.__b = false;
        
        B.constructor = function(arg) {
            this._b = arg;
        };
        
        B.prototypes.include(A.new(true));
        
        var b = B.new(false);
        
        b.__b.should.be.false;
        b._b.should.be.false;
        
        b.__a.should.be.true;
        b._a.should.be.true;
        
    });
    
    it('prototypes with nested items', function() {
        
        var A = Type.inherit();
        
        A.prototype.__a = true;
        
        A.constructor = function(arg) {
            this._a = arg;
        };
        
        var C = Type.inherit();
        
        C.prototype.__c = true;
        
        C.constructor = function(arg) {
            this._c = arg;
        };
        
        var D = Type.inherit();
        
        D.prototype.__d = false;
        
        D.constructor = function(arg) {
            this._d = arg;
        };
        
        D.prototypes.include(C.new(true));
        
        var B = Type.inherit();
        
        B.prototype.__b = false;
        
        B.constructor = function(arg) {
            this._b = arg;
        };
        
        B.prototypes.include(A.new(true), D.new(false));
        
        var b = B.new(false);
        
        b.__b.should.be.false;
        b._b.should.be.false;
        
        b.__a.should.be.true;
        b._a.should.be.true;
        
        b.__d.should.be.false;
        b._d.should.be.false;
        
        b.__c.should.be.true;
        b._c.should.be.true;
        
    });
    
    it('prototypes with nested items and types', function() {
        
        var A = Type.inherit();
        
        A.prototype.__a = true;
        
        A.constructor = function(arg) {
            this._a = arg;
        };
        
        var C = Type.inherit();
        
        C.prototype.__c = true;
        
        C.constructor = function(arg) {
            this._c = arg;
        };
        
        var D = Type.inherit();
        
        D.prototype.__d = false;
        
        D.constructor = function(arg) {
            this._d = arg;
        };
        
        D.prototypes.include(C.new(true));
        
        var B = Type.inherit();
        
        B.prototype.__b = false;
        
        B.constructor = function(arg) {
            this._b = arg;
        };
        
        B.prototypes.include(A, D.new(false));
        
        var b = B.new(false);
        
        b.__b.should.be.false;
        b._b.should.be.false;
        
        b.__a.should.be.true;
        
        b.__d.should.be.false;
        b._d.should.be.false;
        
        b.__c.should.be.true;
        b._c.should.be.true;
        
    });
    
});
