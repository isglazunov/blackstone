// blackstone:develop
// https://github.com/isglazunov/blackstone/tree/develop

// Commenting Rules

// Headlines without full stops and commas, and separated indented.
// Descriptions with dots and commas.

// Help

// Uses the prefix __ to indicate the system variables. Use the system variables with the understanding!

// Module
(function() {
    
    // Blackstone Version
    // Version for internal use
    var __version = 'develop';
    
    // new Blackstone(lodash, async)
    // Main constructor
    var Blackstone = function(lodash, async) {
        var blackstone = this;
        
        // new blackstone.Blackstone(lodash, async)
        blackstone.Blackstone = Blackstone;
        
        // blackstone.dependencies
        blackstone.dependencies = {
            lodash: lodash, async: async
        };
        
        // blackstone.version
        blackstone.version = __version;
    };
    
    // Blackstone.version
    Blackstone.version = __version;
    
    // Blackstone Connector
    // Library has no control over the version dependencies.
    // This means that the user is responsible for choosing the appropriate version of the dependent libraries.

    // Define (AMD/Require.js)
    if(typeof(define) !== 'undefined' && define.amd) {
        define(['module', 'lodash', 'async'], function(module, lodash, async){
            module.exports = new Blackstone(lodash, async);
        });
    }
    
    // Require (Node.js)
    if(typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined' && typeof(require) == 'function') {
        module.exports = new Blackstone(require('lodash'), require('async'));
    }
    
    // Window (DOM)
    if(typeof(window) !== 'undefined') window.Blackstone = Blackstone;
    
    // Global (Node.js)
    if(typeof(global) !== 'undefined') global.Blackstone = Blackstone;

}());