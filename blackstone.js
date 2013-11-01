// blackstone:develop
// https://github.com/isglazunov/blackstone/tree/develop

// Module
(function(){
    
    // Constructor
    var Blackstone = function(lodash, async){
        var blackstone = this; // Alias instance
        
        blackstone.Blackstone = Blackstone; // Alias constructor
        
        // Dependencies.
        blackstone.dependencies = {
            lodash: lodash, async: async
        };
    };
    
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