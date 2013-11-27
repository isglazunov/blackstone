require('should');
var blackstone = require('../../blackstone.js');

describe('traveler', function() {
    
    // Должен асинхронно выполнять итерации.
    it('async', function(done) {
        
        var ended = false;
        
        blackstone.traveler({
            sync: false,
            args: [ 0 ],
            handler: function(num) {
                ended.should.be.true; // Если итерации выполнены асинхронно, переменная измениться на true.
                
                if (num < 5) this.return(++num);
                else done();
            }
        });
        
        ended = true;
        
    });
    
    // Должен синхронно выполнять итерации.
    it('sync', function() {
        
        var ended = false;
        var callbacked = false;
        
        blackstone.traveler({
            sync: true,
            args: [ 0 ],
            handler: function(num) {
                ended.should.be.false; // Если итерации выполнены синхронно, переменная не измениться.
                
                if (num < 5) return [++num];
                else callbacked = true;
            }
        });
        
        ended = true;
        callbacked.should.be.true;
        
    });
    
    // Не должен переполнять стек вызовов.
    describe('stack', function() {
        
        it('async', function(done) {
            
            var allow = true;
            
            setTimeout(function() {
                allow = false;
            }, 1000);
            
            blackstone.traveler({
                sync: false,
                handler: function() {
                    if (allow) this.return();
                    else done();
                }
            });
            
        });
        
        it('sync', function() {
            
            var counter = 0;
            
            blackstone.traveler({
                sync: true,
                handler: function() {
                    counter++;
                    if (counter < 30000) return [];
                    else {
                        counter.should.be.eql(30000);
                    }
                }
            });
            
        });
        
    });
    
    describe('load', function() {
        
        it('async', function(done) {
            
            var counter = 0;
            
            blackstone.traveler({
                sync: false,
                handler: function() {
                    counter++;
                    if (counter < 30000) this.return();
                    else {
                        counter.should.be.eql(30000);
                        done();
                    }
                }
            });
            
        });
        
        it('sync', function() {
            
            var counter = 0;
            
            blackstone.traveler({
                sync: true,
                handler: function() {
                    counter++;
                    if (counter < 30000) return [];
                    else {
                        counter.should.be.eql(30000);
                    }
                }
            });
            
        });
    });
});