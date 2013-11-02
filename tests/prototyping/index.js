require('should');
var lodash = require('lodash');
var blackstone = require('../../blackstone.js');

describe('blackstone', function(){
    describe('prototyping', function(){
        var prototyping = blackstone.prototyping;
        it('should be a object', function(){
            prototyping.should.have.type('object');
        });
        describe('Prototype', function(){
            var Prototype = prototyping.Prototype;
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
                it('should have an index of 1 prototype', function(){
                    prototype.index.should.be.eql(0);
                });
                it('should have method new', function(){
                    prototype.new.should.have.type('function');
                });
                describe('Instance', function(){
                    var Instance = prototyping.Instance;
                    it('should be a function', function(){
                        Instance.should.have.type('function');
                    });
                    describe('instance', function(){
                        var instance;
                        it('prototype.new should return instance', function(){
                            prototype.constructor = function(options){
                                lodash.merge(this, options);
                            };
                            instance = prototype.new({ name: 'blackstone' });
                        });
                        it('should be an instanceof Instance', function(){
                            instance.should.be.an.instanceof(Instance);
                        });
                        it('should contain arguments passed to the method prototype.new', function(){
                            instance.name.should.be.eql('blackstone');
                        });
                        describe('multiple inheritance', function(){
                            var A = new Prototype({ 
                                constructor: function(){
                                    this.a = 1;
                                }
                            });
                            A.prototype._a = 11;
                            
                            var B = new Prototype({ constructor: {b: 2} });
                            B.prototype._b = 22;
                            
                            var C = new Prototype({ constructor: {c: 3} });
                            C.prototype._c = 33;
                            C.prototypes.push(A.new(), B.new());
                            
                            var c = C.new();
                            
                            it('should inherit attributes from all attached prototypes', function(){
                                c.a.should.be.eql(1);
                                c.b.should.be.eql(2);
                                c.c.should.be.eql(3);
                                c._a.should.be.eql(11);
                                c._b.should.be.eql(22);
                                c._c.should.be.eql(33);
                            });
                            it('prototype instanceof', function(){
                                C.instanceof(A).should.be.true;
                                C.instanceof(B).should.be.true;
                                C.instanceof(C).should.be.true;
                                B.instanceof(A).should.be.false;
                            });
                            it('instance instanceof', function(){
                                c.instanceof(A).should.be.true;
                                c.instanceof(B).should.be.true;
                                c.instanceof(C).should.be.true;
                                
                                var b = B.new();
                                b.instanceof(A).should.be.false;
                            });
                        });
                    });
                });
            });
        });
    });
});