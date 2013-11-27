require('should');
var blackstone = require('../../blackstone.js');

describe('iterator', function() {
    
    // Должен асинхронно выполнять итерации.
    it('async', function(done) {
        var ended = false;
        
        blackstone.iterator({
            sync: false,
            exports: {
                counter: 0
            }, condition: function() {
                if (this.exports.counter == 5) this.return(false);
                else {
                    this.exports.counter++;
                    this.return(true);
                }
            }, handler: function() {
                this.return();
            }, callback: function() {
                ended.should.be.true; // Если итерации выполнены асинхронно, переменная измениться на true.
                
                done();
            }
        });
        
        ended = true;
    });
    
    // Должен синхронно выполнять итерации.
    it('sync', function() {
        var ended = false;
        var callbacked = false;
        
        blackstone.iterator({
            sync: true,
            exports: {
                counter: 0
            }, condition: function() {
                if (this.exports.counter == 5) return false;
                else {
                    this.exports.counter++;
                    return [true];
                }
            },
            handler: function() {},
            callback: function() {
                ended.should.be.false; // Если итерации выполнены синхронно, переменная не измениться.
                callbacked = true;
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
            
            blackstone.iterator({
                condition: function() {
                    this.return(allow);
                }, handler: function() {
                    this.return();
                }, callback: function() {
                    done();
                }
            });
            
        });
        
        it('sync', function(done) {
            
            var allow = true;
            
            setTimeout(function() {
                allow = false;
            }, 1000);
            
            blackstone.iterator({
                sync: true,
                condition: function() {
                    return allow;
                },
                handler: function() {},
                callback: function() {
                    done();
                }
            });
            
        });
        
    });
});