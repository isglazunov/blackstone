require('should');
var blackstone = require('../../blackstone.js');

describe('blackstone typing', function(){
    
    // Множественное наследование прототипов
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
    
    // Быстрое наследование от типа
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
    
    // Создание item с ожиданием завершения события new
    it('new event', function(done){
        
        var A = new blackstone.Type();
        
        A.bind('new', function(next, a){
            a.a = true;
            setTimeout(next, 50);
        })
        
        A.bind('new', function(next, a){
            a.b = false;
            setTimeout(next, 50);
        })
        
        A.new(function(a){
            a.a.should.be.true;
            a.b.should.be.false;
            done();
        });
    });
});