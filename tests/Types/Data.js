require('should');
var blackstone = require('../../blackstone.js');
var lodash = require('lodash');
var Data = blackstone.Data;

describe('Blackstone Types Data', function() {
    
    var data
    it('Data', function(){
        data = Data.new();
    
        data.__data = { a: 1, b: null, c: undefined };
    });
    
    it('get', function() {
        data.get().should.be.eql({ a: 1, b: null, c: undefined });
    });
    
    it('defaults', function() {
        data.defaults = { a: 3, b: 4, c: 5, d: 6 };
        
        data.get().should.be.eql({ a: 1, b: null, c: 5, d: 6 });
    });
    
    it('set', function() {
        data.set({ b: 2 });
        
        data.__data.should.be.eql({ a: 3, b: 2, c: 5, d: 6 });
    });
    
});