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
    
});
