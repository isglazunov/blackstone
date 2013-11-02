require('should');
var lodash = require('lodash');
var blackstone = require('../../blackstone.js');

describe('blackstone', function(){
    describe('types', function(){
        
        var types = blackstone.types;
        
        it('should have type object', function(){
            types.should.have.type('object');
        });
        
        describe('Server', function(){
            
            var Server = types.Server;
            
            it('should be an instanceof Prototype', function(){
                Server.should.be.an.instanceof(blackstone.Prototype);
            });
            
            describe('server', function(){
                
                var server = Server.new();
                /*
                it('describe', function(){
                    server.describe("type", function(client, exports){
                        exports.sync = function(){ return true; };
                    }, {sync: true});
                    
                    server.describe("type", function(next, client, exports){
                        exports.async = function(){
                            setTimeout(function(){
                                client.async = false;
                            }, 100);
                        };
                        next();
                    });
                });*/
                
                
                
                var C1 = types.Client;
                console.dir(C1);
                console.log("\r\n");
                
                var c1 = C1.new();
                console.dir(c1);
                console.log("\r\n");
                
                var C2 = c1.extend();
                console.dir(C2);
                console.log("\r\n");
                
                var c2 = C2.new();
                console.dir(c2);
                console.log("\r\n");
                
                /*
                var Client = types.Client.new().extend({ _server: server })
                
                var client = Client.new();
                client._types.push('user');
                
                it('initialize', function(done){
                    client.initialize(function(client){
                        console.dir(client.as("type"))
                        client.sync = client.as("type").sync();
                        client.as("type").async();
                    });
                    setTimeout(function(){
                        client.sync.should.be.true;
                        client.async.should.be.false;
                        done();
                    }, 500); 
                });
                */
            });
            
        });
    });
});