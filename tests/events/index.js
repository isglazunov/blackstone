require('should');
var lodash = require('lodash');
var blackstone = require('../../blackstone.js');

describe('blackstone', function(){
    
    describe('Events', function(){
        
        var Events = blackstone.Events;
        
        describe('events', function(){
            
            var events = new Events;
            
            var results = [];
            
            it('sequence', function(done){
                events.bind("*", function(next, event){
                    results.push(event);
                    next();
                });
                events.bind("action", function(next){
                    setTimeout(function(){
                        results.push(0);
                        next();
                    }, 50);
                }, {limit: 123});
                
                events.bind("action", function(next){
                    setTimeout(function(){
                        results.push(1);
                        next();
                    }, 50);
                }, {limit: 1});
                
                events.bind("action", function(self){
                    self.unbind();
                    setTimeout(function(){
                        results.push(2);
                    }, 80);
                }, {self: true, sync: true});
                
                events.bind("action", function(next, number){
                    setTimeout(function(){
                        results.push(number);
                        next();
                    }, 50);
                });
                
                events.bind("action", function(self, next){
                    self.unbind();
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
                }, 1000);
            });
        });
    });
});