// blackstone:develop
// https://github.com/isglazunov/blackstone/tree/develop

// Module
(function(){
    
    // Constructor
    var Blackstone = function(lodash, async){
        var blackstone = this; // Alias instance
        
        blackstone.Blackstone = Blackstone; // Alias constructor
        
        // Dependencies
        blackstone.dependencies = {
            lodash: lodash, async: async
        };
        
        // Version
        blackstone.version = 'develop';
        
        // Prototyping
        (function(prototyping){
            prototyping.prototypesIndex = 0;
            prototyping.instancesIndex = 0;
            
            // Prototype
            var Prototype = prototyping.Prototype = function(options){
                this.index = prototyping.prototypesIndex++;
                this.constructor = undefined;
                this.prototype = {};
                this.prototypes = [];
                lodash.merge(this, options);
            };
            
            var _instanceof = function(prototype, index){
                if(prototype instanceof Prototype) {
                    if (prototype.index == index) return true;
                    else {
                        for (var p in prototype.prototypes) {
                            if (_instanceof(prototype.prototypes[p].prototype, index)) return true;
                        }
                    }
                }
                return false;
            };
            
            Prototype.prototype.new = function(){
                var prototype = this;
                
                var pre = function(){};
                pre.prototype = new Instance;
                
                // prototypes.prototypes
                lodash.each(prototype.prototypes, function(ins){
                    if (ins instanceof Instance && ins.prototype && ins.prototype.prototype)
                        lodash.merge(pre.prototype, ins.prototype.prototype);
                });
                
                // prototype.prototype
                if (prototype.prototype) lodash.merge(pre.prototype, prototype.prototype);
                
                var instance = new pre;
                
                // prototypes instances
                lodash.each(prototype.prototypes, function(ins){
                    if (ins instanceof Instance) lodash.merge(instance, ins);
                });
                
                instance.prototype = prototype;
                
                // constructor
                if (lodash.isFunction(prototype.constructor)) prototype.constructor.apply(instance, arguments);
                else if(lodash.isObject(prototype.constructor)) lodash.merge(instance, prototype.constructor);
                
                instance.index = prototyping.instancesIndex++;
                
                return instance;
            };
            
            Prototype.prototype.instanceof = function(){
                for (var a in arguments) {
                    if (!_instanceof(this, arguments[a].index)) return false;
                }
                return true;
            };
            
            // Instance
            var Instance = prototyping.Instance = function(){};
            
            Instance.prototype.instanceof = function(){
                for (var a in arguments) {
                    if (arguments[a] instanceof Prototype) {
                        if (!_instanceof(this.prototype, arguments[a].index)) return false;
                    }
                }
                return true;
            };
            
        }(blackstone.prototyping = {}))
    };
    
    // Version
    Blackstone.version = 'develop';
    
    // Connector
    // Library has no control over the version dependencies
    // This means that the user is responsible for choosing the appropriate version of the dependent libraries
    (function(){
        
        // define (AMD/Require.js)
        if(typeof(define) !== 'undefined' && define.amd) {
            define(['module', 'lodash', 'async'], function(module, lodash, async){
                module.exports = new Blackstone(lodash, async);
            });
        }
        
        // require (Node.js)
        if(typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined' && typeof(require) == 'function') {
            module.exports = new Blackstone(require('lodash'), require('async'));
        }
        
        // window (DOM)
        if(typeof(window) !== 'undefined') window.Blackstone = Blackstone;
        
        // global (Node.js)
        if(typeof(global) !== 'undefined') global.Blackstone = Blackstone;
    }());

}());