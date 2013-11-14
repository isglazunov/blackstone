require('should');
var blackstone = require('../../blackstone.js');
var lodash = require('lodash');
var Data = blackstone.Typing.Data;

describe('Blackstone Typing Data', function() {
    
    var data
    it('Data', function(){
        data = Data.new();
    
        data.__data = { a: 1, b: null, c: 2 };
    });
    
    it('extend has keys values get', function() {
        data.extend({ a: 2, c: undefined });
        
        data.__data.should.be.eql({ a: 2, b: null, c: undefined });
    });
    
    it('has', function(){    
        data.has('a').should.be.true;
        data.has('b').should.be.true;
        data.has('c').should.be.true;
        data.has('d').should.be.false;
    });
    
    it('keys values get', function() {
        data.keys().should.be.eql(['a','b','c']);
        data.values().should.be.eql([2, null, undefined]);
        data.get().should.be.eql({ a: 2, b: null, c: undefined });
    });
    
    it('defaults', function() {
        data.defaults = { a: 3, b: 4, c: 5, d: 6 };
        
        data.get().should.be.eql({ a: 2, b: null, c: 5, d: 6 });
    });
    
});