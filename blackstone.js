// blackstone:develop
// https://github.com/isglazunov/blackstone/tree/develop

// Constructor
var Blackstone = function(lodash, async){
    var blackstone = this; // Alias
    
    return this; // No need to write `new`
};

// Connector
// Library has no control over the version dependencies
// This means that the user is responsible for choosing the appropriate version of the dependent libraries
(function(Blackstone){
    
    // define (AMD/Require.js)
    if(typeof(define) !== 'undefined' && define.amd) {
        define(['module', 'lodash', 'async'], function(module, lodash, async){
            module.exports = Blackstone(lodash, async);
        });
    }
    
    // require (Node.js)
    if(typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined' && typeof(require) == 'function') {
        module.exports = Blackstone(require('lodash'), require('async'));
    }
    
    // window (DOM)
    if(typeof(window) !== 'undefined') window.Blackstone = Blackstone;
    
}(Blackstone);