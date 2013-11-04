require('should');
var lodash = require('lodash');
var blackstone = require('../../blackstone.js');

describe('blackstone document', function(){
    
    var Document = blackstone.Document;
    
    it('get', function(){
        var A = Document.inherit({ constructor: { __document: { a: true } } });
        var a = A.new();
        a.get().a.should.be.true;
    });
    
    it('set', function(){
        var A = Document.inherit({ constructor: { __document: { a: true } } });
        var a = A.new();
        a.set({ a: false }).get().a.should.be.false;
    });
    
    it('reset', function(){
        var A = Document.inherit({ constructor: { __document: { a: true } } });
        var a = A.new();
        a.set({ c: false }).get().should.eql({ a: true, c: false });
        a.reset({ b: false }).get().should.eql({ b: false });
    });
    
    it('unset', function(){
        var A = Document.inherit({ constructor: { __document: { a: true } } });
        var a = A.new();
        a.unset().get().should.eql({});
    });
    
    describe('with events', function(){
        
        it('get', function(){
            var A = Document.inherit({ constructor: { __document: { a: true } } });
            var a = A.new();
            a.bind('get', function(next, doc){
                if (lodash.isEqual(doc, { a: true })) a.set({ b: false });
                next();
            });
            a.get(function(doc){
                doc.should.be.eql({ a: true, b: false });
            })
        });
        
        it('set', function(){
            var A = Document.inherit({ constructor: { __document: { a: true } } });
            var a = A.new();
            a.bind('set', function(next, doc, prev, data){
                if (lodash.isEqual(doc, { a: true, c: true })) a.set({ b: false });
                next();
            });
            a.set({ c: true }, function(doc, prev, data){
                doc.should.be.eql({ a: true, b: false, c: true });
            })
        });
        
        it('reset', function(){
            var A = Document.inherit({ constructor: { __document: { a: true } } });
            var a = A.new();
            a.bind('reset', function(next, doc, prev, data){
                a.set({ b: false });
                next();
            });
            a.reset({ c: true }, function(doc, prev, data){
                doc.should.be.eql({ b: false, c: true });
            })
        });
        
        it('unset', function(){
            var A = Document.inherit({ constructor: { __document: { a: true } } });
            var a = A.new();
            a.bind('unset', function(next, doc, prev){
                a.set({ b: false });
                next();
            });
            a.unset(function(doc, prev){
                doc.should.be.eql({ b: false });
            })
        });
        
    });
    
});