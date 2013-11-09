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
        
        // new .Blackstone(lodash, async)
        blackstone.Blackstone = Blackstone;
        
        // .dependencies name: dependence
        blackstone.dependencies = {
            lodash: lodash, async: async
        };
        
        // .version String
        blackstone.version = __version;
        
        // Blackstone Lists // start
        
        blackstone.lists = (function() {
            
            var lists = {};
            
            lists.List = (function() {
                
                var id = 0;
                
                var List = function() {
                    this.id = id++;
                    
                    this.length = 0;
                    
                    this.first = undefined;
                    this.last = undefined;
                };
                
                // Unsafe // start
                
                // Linking with a list of positions // start
                
                List.prototype.__setSingle = function(position) {
                    this.first = this.last = position;
                };
                
                List.prototype.__setFirst = function(position) {
                    this.first = position;
                };
                
                List.prototype.__setLast = function(position) {
                    this.last = position;
                };
                
                // Linking with a list of positions // end
                
                // Unlinking with a list of positions
                // Attention! The position should be complete!
                List.prototype.__remove = function(position) {
                    if (this.first == position && this.last == position) {
                        this.first = this.last = undefined;
                        
                    } else if (!this.first !== position && this.last == position) {
                        if (position.prev) this.last = position.prev;
                        else throw new Error('The position should be complete!');
                        
                    } else if (this.first == position && !this.last !== position) {
                        if (position.next) this.first = position.next;
                        else throw new Error('The position should be complete!');
                    }
                    
                    this.length--;
                };
                
                // Unsafe // end
                
                // Safe // start
                
                List.prototype.remove = function(supers) {
                    for (var s in supers) {
                        supers[s].in(this).remove();
                    }
                    
                    return this.length;
                };
                
                List.prototype.append = function(supers) {
                    
                    if (supers.length > 0) {
                        for (var s = 0; s < supers.length; s++) {
                            var pos = supers[s].in(this);
                            
                            if (this.last) {
                                this.last.__addAfter(pos);
                                this.__setLast(pos);
                            } else {
                                this.__setSingle(pos);
                            }
                            
                            this.length++;
                            pos.exists = true;
                        }
                    }
                    
                    return this.length;
                };
                
                List.prototype.prepend = function(supers) {
                    
                    if (supers.length > 0) {
                        for (var s = supers.length - 1; s > 0-1; s--) {
                            var pos = supers[s].in(this);
                            
                            if (this.first) {
                                this.first.__addBefore(pos);
                                this.__setFirst(pos);
                            } else {
                                this.__setSingle(pos);
                            }
                            
                            this.length++;
                            pos.exists = true;
                        }
                    }
                    
                    return this.length;
                };
                
                // Safe // end
                
                return List;
                
            })();
            
            lists.Position = (function() {
                
                var id = 0;
                
                var Position = function(list) {
                    this.id = id++;
                    
                    this.exists = false;
                    
                    this.next = undefined;
                    this.prev = undefined;
                    
                    this.list = list;
                };
                
                // Unsafe // start
                
                // Linking with a position // start
                
                Position.prototype.__addBefore = function(pos) {
                    if (this.prev) {
                        this.prev.next = pos;
                        pos.prev = this.prev;
                    }
                    this.prev = pos;
                    pos.next = this;
                };
                
                Position.prototype.__addAfter = function(pos) {
                    if (this.next) {
                        this.next.prev = pos;
                        pos.next = this.next;
                    }
                    this.next = pos;
                    pos.prev = this;
                };
                
                // Linking with a position // end
                
                // Unlinking with the positions
                Position.prototype.__remove = function() {
                    if (this.prev && this.next) {
                        this.prev.next = this.next;
                        this.next.prev = this.prev;
                        
                    } else if (this.prev && !this.next) {
                        this.prev.next = undefined;
                    
                    } else if (!this.prev && this.next) {
                        this.next.prev = undefined;
                    }
                    
                    this.next = this.prev = undefined;
                };
                
                // Unsafe // end
                
                // Safe // start
                
                Position.prototype.remove = function() {
                    this.list.__remove(this);
                    this.__remove();
                    this.exists = false;
                };
                
                Position.prototype.append = function(supers) {
                        
                    if (this == this.list.last) {
                        return this.list.append(supers);
                        
                    } else {
                        for (var s = supers.length-1; s > 0-1; s--) {
                            var pos = supers[s].in(this.list);
                            
                            if (pos.exists) continue;
                            
                            this.__addAfter(pos);
                            
                            this.list.length++;
                            pos.exists = true;
                        }
                    }
                    
                    return this.list.length;
                };
                
                Position.prototype.prepend = function(supers) {
                        
                    if (this == this.list.first) {
                        return this.list.prepend(supers);
                        
                    } else {
                        for (var s = 0; s < supers.length; s++) {
                            var pos = supers[s].in(this.list);
                            
                            if (pos.exists) continue;
                            
                            this.__addBefore(pos);
                            
                            this.list.length++;
                            pos.exists = true;
                        }
                    }
                    
                    return this.list.length;
                };
                
                // Safe // end
                
                return Position;
                
            })();
            
            lists.Superposition = (function(List, Position) {
                
                var id = 0;
                
                var Superposition = function() {
                    this.id = id++;
                    
                    this.lists = {};
                };
                
                // Provides position of superposition in this list
                Superposition.prototype.in = function(list) {
                    if (this.lists[list.id]) return this.lists[list.id];
                    else this.lists[list.id] = new Position(list);
                    
                    return this.lists[list.id];
                };
                
                return Superposition;
                
            })(lists.List, lists.Position);
            
            return lists;
            
        })();
        
        // Blackstone Lists // end
    };
    
    // Blackstone.version String
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