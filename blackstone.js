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
    
    // new (lodash, async)
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
        
        // Blackstone Lists
        blackstone.lists = (function() {
            
            var lists = {};
            
            lists.List = (function() {
                
                var id = 0;
                
                // new ()
                var List = function() {
                    this.id = id++;
                    
                    this.length = 0;
                    
                    this.first = undefined;
                    this.last = undefined;
                };
                
                // Unsafe // start
                
                // Linking with a list of positions // start
                
                // (position Position)
                List.prototype.__setSingle = function(position) {
                    this.first = this.last = position;
                };
                
                // (position Position)
                List.prototype.__setFirst = function(position) {
                    this.first = position;
                };
                
                // (position Position)
                List.prototype.__setLast = function(position) {
                    this.last = position;
                };
                
                // Linking with a list of positions // end
                
                // Unlinking with a list of positions
                // Attention! The position should be complete!
                // (position Position)
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
                
                // (superpositions [Superposition])
                List.prototype.remove = function(supers) {
                    for (var s in supers) {
                        supers[s].in(this).remove();
                    }
                    
                    return this.length;
                };
                
                // (superpositions [Superposition])
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
                
                // (superpositions [Superposition])
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
                
                // (handler Function⎨, options Object⎬)
                List.prototype.each = function(handler, _options) {
                    
                    if (!lodash.isObject(_options)) var _options = {};
                    
                    var options = lodash.defaults(_options, {
                        sync: false,
                        reverse: false
                    });
                    
                    if (!options.reverse) {
                        var now = this.first;
                        var counter = 0;
                        
                        var move = function() {
                            now = now.next;
                        };
                        
                        var getCounter = function() {
                            return counter++;
                        };
                    } else {
                        var now = this.last;
                        var counter = this.length-1;
                        
                        var move = function() {
                            now = now.prev;
                        };
                        
                        var getCounter = function() {
                            return counter--;
                        };
                    }
                    
                    var next = function() {
                        move();
                        iteration();
                    };
                    if (!options.sync) {
                        var handling = function() {
                            handler(next, getCounter(), now.superposition, now);
                        };
                    } else {
                        var handling = function() {
                            handler(getCounter(), now.superposition, now);
                            next();
                        };
                    }
                    
                    var iteration = function() {
                        if (now) {
                            handling();
                        } else handler();
                    };
                    
                    iteration();
                    
                };
                
                // Safe // end
                
                return List;
                
            })();
            
            lists.Position = (function() {
                
                var id = 0;
                
                // new (list List, superposition Superposition)
                var Position = function(list, superposition) {
                    this.id = id++;
                    
                    this.exists = false;
                    
                    this.next = undefined;
                    this.prev = undefined;
                    
                    this.list = list;
                    
                    this.superposition = superposition;
                };
                
                // Unsafe // start
                
                // Linking with a position // start
                
                // (position Position)
                Position.prototype.__addBefore = function(pos) {
                    if (this.prev) {
                        this.prev.next = pos;
                        pos.prev = this.prev;
                    }
                    this.prev = pos;
                    pos.next = this;
                };
                
                // (position Position)
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
                // ()
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
                // ()
                Position.prototype.remove = function() {
                    this.list.__remove(this);
                    this.__remove();
                    this.exists = false;
                };
                
                // (superpositions [Superposition])
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
                
                // (superpositions [Superposition])
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
                // (list List)
                Superposition.prototype.in = function(list) {
                    if (this.lists[list.id]) return this.lists[list.id];
                    else this.lists[list.id] = new Position(list, this);
                    
                    return this.lists[list.id];
                };
                
                return Superposition;
                
            })(lists.List, lists.Position);
            
            return lists;
            
        })();
        
        // Blackstone Events
        blackstone.events = (function(lists) {
            
            var events = {};
            
            events.Handler = (function() {
                
                // new (position Position, superhandler Superhandler)
                var Handler = function(position, superhandler) {
                    
                    this.position = position;
                    this.superhandler = superhandler;
                    
                };
                
                // ~ adapter
                Handler.prototype.bind = function() {
                    this.superhandler.bind.apply(this.superhandler, arguments);
                };
                
                // ~ adapter
                Handler.prototype.trigger = function() {
                    this.superhandler.bind.apply(this.superhandler, arguments);
                };
                
                // ()
                Handler.prototype.unbind = function() {
                    this.position.remove();
                };
                
                return Handler;
                
            })();
            
            events.Superhandler = (function(Handler) {
                
                var id = 0;
                
                var defaults = {
                    sync: false,
                    self: false,
                    this: false
                };
                
                // new ()
                var Superhandler = function() {
                    
                    this.id = id++;
                    
                    var superposition = new lists.Superposition();
                    superposition.superhandler = this;
                    
                    this.superposition = superposition;
                    
                    this.options = undefined;
                    this.method = undefined;
                    
                };
                
                // (handlers Handlers)
                Superhandler.prototype.in = function(handlers) {
                    
                    var superhandler = this;
                    
                    var position = this.superposition.in(handlers.list);
                    
                    if (position) {
                        if (!position.handler) position.handler = new Handler(position, superhandler);
                        
                        return position.handler;
                    } else return undefined;
                    
                };
                
                // (method Function⎨, options Object⎬);
                Superhandler.prototype.bind = function(method, options) {
                    
                    if (!lodash.isObject(options)) var options = {};
                    
                    var options = lodash.defaults(options, defaults);
                    
                    this.method = method;
                    this.options = options;
                    
                };
                
                // Only if bound!
                // (args Array⎨, callback() Function⎬);
                Superhandler.prototype.trigger = function(args, callback) {
                    
                    var superhandler = this;
                    
                    var applyArgs = [];
                    
                    var alreadyNext = false;
                    
                    var next = function() {
                        if (!alreadyNext) {
                            alreadyNext = true;
                            if (callback) callback();
                        }
                    };
                    
                    if (superhandler.options.self) applyArgs.push(superhandler);
                    
                    if (!superhandler.options.sync) applyArgs.push(next);
                    
                    applyArgs.push.apply(applyArgs, args);
                    
                    var caller = function() {
                        superhandler.method.apply(superhandler.options.this, applyArgs);
                    };
                    
                    if (superhandler.options.sync) {
                        caller();
                        next();
                    } else {
                        caller();
                    }
                    
                };
                
                return Superhandler;
                
            })(events.Handler);
            
            events.Handlers = (function(Superhandler) {
                
                // new ()
                var Handlers = function() {
                    
                    var list = new lists.List;
                    list.handlers = this;
                    
                    this.list = list;
                    
                };
                
                // (args Array⎨, callback Function⎬)
                Handlers.prototype.trigger = function(args, callback) {
                    
                    this.list.each(function(next, counter, superposition, position) {
                        if (next) {
                            superposition.superhandler.trigger(args, next);
                        } else if (callback) callback();
                    });
                    
                };
                
                // (handler Function⎨, options Object⎬)
                // (handler Superhandler)
                // => superhandler
                Handlers.prototype.bind = function(handler, options) {
                    
                    if (lodash.isFunction(handler)) {
                        var superhandler = new Superhandler;
                        superhandler.bind.apply(superhandler, arguments);
                    } else if (lodash.isObject(handler) && handler instanceof Superhandler) {
                        var superhandler = handler;
                    } else throw new TypeError('selector');
                    
                    this.list.append([superhandler.superposition]);
                    
                    return superhandler;
                }
                
                return Handlers;
                
            })(events.Superhandler);
            
            events.Emitter = (function(Handlers) {
                
                // new ()
                var Emitter = function() {
                    this.__handlers = {};
                };
                
                // (name String, args Array⎨, callback Function⎬)
                Emitter.prototype.trigger = function(name, args, callback) {
                    
                    this.__event(name).trigger(args, callback);
                    
                };
                
                // (name String)
                // => handlers Handlers
                Emitter.prototype.__event = function(name) {
                    if (!this.__handlers[name]) this.__handlers[name] = new Handlers;
                    
                    return this.__handlers[name];
                };
                
                // (name String, handler Function⎨, options Object⎬)
                // (name String, handler Superhandler)
                // => superhandler
                Emitter.prototype.bind = function(name, handler, options) {
                    
                    return this.__event(name).bind(handler, options);
                    
                };
                
                return Emitter;
                
            })(events.Handlers);
            
            return events;
            
        })(blackstone.lists);
        
        // Blackstone Typing
        blackstone.typing = (function(events, lists) {
            
            var typing = {};
            
            typing.Item = (function() {
                
                // ()
                var Item = function() {};
                
                Item.prototype = new events.Emitter;
                
                // (types... Type)
                // => Boolean
                Item.prototype.of = function() {
                    
                    var types = this.__type.__types();
                    
                    for (var a in arguments) {
                        var found = false;
                        
                        for (var p in types.byOrder) {
                            if (types.byOrder[p].id == arguments[a].id) found = true;
                        }
                        
                        if (!found) return false;
                    }
                    
                    return true;
                    
                };
                
                return Item;
                
            })();
            
            typing.Type = (function(Item) {
                
                var id = 0;
                
                // new ()
                var Type = function() {
                    this.id = id++;
                    this.prototype = {};
                    this.constructor = undefined;
                    this.types = [];
                };
                
                Type.prototype = new events.Emitter;
                
                // (results { byId Object, byOrder Array }, from Type)
                var __types = function(results, from) {
                    if (!results.byId[from.id]) {
                        if (from.types) {
                            for (var p in from.types) {
                                __types(results, from.types[p]);
                            }
                        }
                        
                        results.byId[from.id] = from;
                        results.byOrder.push(from);
                    }
                };
                
                // ()
                // => { byId: { id: Type } , byOrder [ older < Type > younger ] }
                Type.prototype.__types = function() {
                    
                    var results = {
                        byId: {},
                        byOrder: []
                    };
                    
                    __types(results, this);
                    
                    return results;
                    
                };
                
                // (attr Array⎨, callback.apply(item, attr) Function⎬)
                // => item Item
                Type.prototype.new = function(attr, callback) {
                    
                    var types = this.__types();
                    
                    // prototypes
                    var _Item = function() {};
                    _Item.prototype = new Item;
                    
                    _Item.prototype.__type = this;
                    
                    for (var p in types.byOrder) {
                        lodash.merge(_Item.prototype, types.byOrder[p].prototype);
                    }
                    
                    // constructor
                    var item = new _Item;
                    
                    for (var p in types.byOrder) {
                        if(lodash.isFunction(types.byOrder[p].constructor)) types.byOrder[p].constructor.apply(item, attr);
                    }
                    
                    // events
                    async.nextTick(function() {
                        async.mapSeries(types.byOrder, function(prototype, next) {
                            prototype.trigger('new', attr, next);
                        }, function() {
                            if (callback) callback.apply(item, attr);
                        });
                    });
                    
                    return item;
                };
                
                // ()
                // => type Type
                Type.prototype.inherit = function() {
                    var type = new Type;
                    
                    type.types.push(this);
                    
                    return type;
                };
                
                // ()
                // => type Type
                Type.inherit = function() {
                    return new Type;
                };
                
                return Type;
                
            })(typing.Item);
            
            return typing;
            
        })(blackstone.events, blackstone.lists);
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