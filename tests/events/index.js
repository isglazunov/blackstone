require('should');
var lodash = require('lodash');
var blackstone = require('../../blackstone.js');

describe('blackstone', function(){
    describe('events', function(){
        
        it('should be a object', function(){
            blackstone.events.should.have.type('object');
        });
        
        describe('Events', function(){
            
            var Events = blackstone.events.Events;
            
            it('should be an instanceof Prototype', function(){
                Events.should.be.an.instanceof(blackstone.prototypes.Prototype);
            });
            
            describe('eventer', function(){
                
                var events = Events.new();
                
                var results = [];
                
                it('should be an instanceof Instance', function(){
                    events.should.be.an.instanceof(blackstone.prototypes.Instance);
                });
                
                it('sequence of events', function(done){
                    events.on("*", function(next, event){
                        results.push(event);
                        next();
                    });
                    events.on("action", function(next){
                        setTimeout(function(){
                            results.push(0);
                            next();
                        }, 50);
                    }, {limit: 123});
                    
                    events.on("action", function(next){
                        setTimeout(function(){
                            results.push(1);
                            next();
                        }, 50);
                    }, {limit: 1});
                    
                    events.on("action", function(self, next){
                        self.off();
                        setTimeout(function(){
                            results.push(2);
                        }, 100);
                    }, {self: true, sync: true});
                    
                    events.on("action", function(next, number){
                        setTimeout(function(){
                            results.push(number);
                            next();
                        }, 50);
                    });
                    
                    events.on("action", function(self, next){
                        self.off();
                        var _this = this;
                        setTimeout(function(){
                            results.push(_this.context);
                            next();
                        }, 50);
                    }, {self: true, context: {context: "context"}});
                    
                    events.trigger("action", [123], function(){
                        results.push("again");
                        events.trigger("action", function(){
                            results.push("done");
                        })
                    })
                    
                    setTimeout(function(){
                        results.should.eql(['action', 0, 1, 123, 2, "context", 'again', 'action', 0, undefined, 'done']);
                        done();
                    }, 500);
                });
            });
        });
    });
});