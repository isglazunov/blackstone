require('should');
var lodash = require('lodash');
var blackstone = require('../../blackstone.js');

describe('blackstone', function(){
    describe('Prototype', function(){
        
        var Prototype = blackstone.Prototype;
        
        it('should be a function', function(){
            Prototype.should.have.type('function');
        });
        
        describe('prototype', function(){
            
            var prototype = new Prototype();
            
            it('should be an instanceof Prototype', function(){
                prototype.should.be.an.instanceof(Prototype);
            });
            it('should have an array of prototypes', function(){
                prototype.prototypes.should.be.eql([]);
            });
                    
            it('prototypes extend and instanceof', function(){
                var A = new Prototype({ constructor: { a: 1 } });
                A.prototype._a = 11;
                
                var B = new Prototype({ constructor: { b: 2 } });
                B.prototype._b = 22;
                
                var C = new Prototype({ constructor: { c: 3 } });
                C.prototype._c = 33;
                C.prototypes.push(A.new(), B.new());
                
                var D = new Prototype({ constructor: { d: 4 } });
                D.prototype._d = 33;
                D.prototypes.push(C.new());
                
                C.instanceof(C).should.be.true;
                C.instanceof(B).should.be.true;
                D.instanceof(A).should.be.true;
                
                A.instanceof(B).should.be.false;
                C.instanceof(D).should.be.false;
            });
            
            describe('prototype.new', function(){
                
                it('should be a function', function(){
                    prototype.new.should.have.type('function');
                });
                
                it('should return instance', function(){
                    var prototype = new Prototype();
                    prototype.constructor = function(options){
                        lodash.merge(this, options);
                    };
                    var instance = prototype.new();
                    instance.should.be.an.instanceof(blackstone.Instance);
                });
            });
            
            describe('Instance', function(){
                
                var Instance = blackstone.Instance;
                
                it('should be a function', function(){
                    Instance.should.have.type('function');
                });
                
                describe('instance', function(){
                    
                    it('should contain arguments passed to the method prototype.new', function(){
                        var prototype = new Prototype({ constructor: { name: 'blackstone' } });
                        var instance = prototype.new();
                        instance.name.should.be.eql('blackstone');
                    });
                    
                    it('prototypes and instanceof', function(){
                        var A = new Prototype({ constructor: { a: 1 } });
                        A.prototype._a = 11;
                        
                        var B = new Prototype({ constructor: { b: 2 } });
                        B.prototype._b = 22;
                        
                        var C = new Prototype({ constructor: { c: 3 } });
                        C.prototype._c = 33;
                        C.prototypes.push(A.new(), B.new());
                        
                        var c = C.new();
                        
                        c.a.should.be.eql(1);
                        c.b.should.be.eql(2);
                        c.c.should.be.eql(3);
                        
                        c._a.should.be.eql(11);
                        c._b.should.be.eql(22);
                        c._c.should.be.eql(33);
                        
                        var D = c.extend({ constructor: { d: 4 }, prototype: { _d: 44 } });
                        var d = D.new();
                        
                        d.b.should.be.eql(2);
                        d._b.should.be.eql(22);
                        d.d.should.be.eql(4);
                        d._d.should.be.eql(44);
                        
                        c.instanceof(C).should.be.true;
                        c.instanceof(B).should.be.true;
                        d.instanceof(A).should.be.true;
                        
                        c.instanceof(D).should.be.false;
                    });
                    
                });
            });
        });
    });
});