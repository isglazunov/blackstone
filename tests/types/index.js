require('should');
var lodash = require('lodash');
var blackstone = require('../../blackstone.js');

describe('blackstone types', function(){
    
    it('multiple inheritance', function(){
        
        var A = new blackstone.Type({
            prototype: { a: true }
        });
        
        var B = new blackstone.Type({
            prototype: { b: true }
        });
        
        var Z = new blackstone.Type({
            prototype: { z: true },
            types: [B]
        });
        
        var C = new blackstone.Type({
            prototype: { c: true },
            types: [A, Z]
        });
        
        var c = C.new();
        
        c.a.should.be.true;
        c.b.should.be.true;
        c.z.should.be.true;
        c.c.should.be.true;
    });
    
    it('type.inherit', function(){
        
        var A = new blackstone.Type({
            prototype: { a: true }
        });
        
        var B = A.inherit({
            prototype: { b: true }
        });
        
        var b = B.new();
        
        b.a.should.be.true;
        b.b.should.be.true;
    });
    
    it('new event', function(done){
        
        var A = new blackstone.Type();
        
        A.bind('new', function(next, args, a){
            a.a = true;
            setTimeout(next, 50);
        })
        
        A.bind('new', function(next, args, a){
            a.b = false;
            setTimeout(next, 50);
        })
        
        A.new(function(a){
            a.a.should.be.true;
            a.b.should.be.false;
            done();
        });
    });
    
    it('behaviors', function(done){
        
        var A = blackstone.Type.inherit();
        A.as('z', function(next, item, exports){
            exports.z = true;
            next();
        });
        
        var B = A.inherit({ __eventsSync: true });
        B.as('y', function(item, exports){
            exports.y = true;
        });
        
        var C = B.inherit(lodash.pick(B, function(value, key){
            return key.search(/^__events/g) != -1;
        }));
        
        C.as('x', function(item, exports){
            exports.x = true;
        });
        
        C.new(function(c){
            c.as('z').z.should.be.true;
            c.as('y').y.should.be.true;
            c.as('x').x.should.be.true;
            
            done();
        });
    });
});