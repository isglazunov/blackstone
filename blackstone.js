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
                    
                    this.value = undefined;
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
                
                // (superpositions... Superposition)
                List.prototype.remove = function() {
                    for (var s in arguments) {
                        arguments[s].in(this).remove();
                    }
                    
                    return this.length;
                };
                
                // (superpositions... Superposition)
                List.prototype.append = function() {
                    
                    if (arguments.length > 0) {
                        for (var s = 0; s < arguments.length; s++) {
                            var pos = arguments[s].in(this);
                            
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
                
                // (superpositions... Superposition)
                List.prototype.prepend = function() {
                    
                    if (arguments.length > 0) {
                        for (var s = arguments.length - 1; s > 0-1; s--) {
                            var pos = arguments[s].in(this);
                            
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
                
                // (handler Function⎨, options { sync Boolean, reverse Boolean, callback Function }⎬)
                List.prototype.each = function(handler, _options) {
                    
                    var list = this;
                    
                    if (!lodash.isObject(_options)) var _options = {};
                    
                    var options = lodash.defaults(_options, {
                        sync: false,
                        reverse: false,
                        callback: undefined
                    });
                    
                    var counter = undefined;
                    var position = undefined;
                    var future = undefined
                    
                    if (!options.reverse) {
                        counter = 0;
                        position = list.first;
                        if (position) future = position.next;
                        
                        var move = function() {
                            position = position.next;
                            future = position.next;
                            counter++;
                        };
                    } else {
                        counter = list.length - 1;
                        position = list.last;
                        if (position) future = position.prev;
                        
                        var move = function() {
                            position = position.prev;
                            future = position.prev;
                            counter--;
                        };
                    }
                    
                    var next = function() {
                        if (future) {
                            move();
                            iteration();
                        } else if (options.callback) options.callback();
                    };
                    
                    if (!options.sync) {
                        var iteration = function() {
                            
                            handler.call({
                                counter: counter,
                                position: position,
                                superposition: position.super,
                                list: list,
                                next: next
                            }, position.super, position, list);
                        };
                    } else {
                        var iteration = function() {
                            handler.call({
                                counter: counter,
                                position: position,
                                superposition: position.super,
                                list: list
                            }, position.super, position, list);
                            
                            if (future) next();
                            else if (options.callback) options.callback();
                        };
                    }
                    
                    if (list.length > 0) iteration();
                    else if (options.callback) options.callback();
                    
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
                    
                    this.super = superposition;
                    
                    this.value = undefined;
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
                    if (this.exists) {
                        this.list.__remove(this);
                        this.__remove();
                        this.exists = false;
                    }
                };
                
                // (superpositions... Superposition)
                Position.prototype.append = function() {
                        
                    if (this == this.list.last) {
                        return this.list.append.apply(this.list, arguments);
                        
                    } else {
                        for (var s = arguments.length-1; s > 0-1; s--) {
                            var pos = arguments[s].in(this.list);
                            
                            if (pos.exists) continue;
                            
                            this.__addAfter(pos);
                            
                            this.list.length++;
                            pos.exists = true;
                        }
                    }
                    
                    return this.list.length;
                };
                
                // (superpositions... Superposition)
                Position.prototype.prepend = function() {
                        
                    if (this == this.list.first) {
                        return this.list.prepend.apply(this.list, arguments);
                        
                    } else {
                        for (var s = 0; s < arguments.length; s++) {
                            var pos = arguments[s].in(this.list);
                            
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
                    this.value = undefined;
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
                    this: false
                };
                
                // new ()
                var Superhandler = function() {
                    
                    this.id = id++;
                    
                    var superposition = new lists.Superposition();
                    superposition.value = this;
                    
                    this.super = superposition;
                    
                    this.options = undefined;
                    this.method = undefined;
                    
                };
                
                // (handlers Handlers)
                Superhandler.prototype.in = function(handlers) {
                    
                    var superhandler = this;
                    
                    var position = this.super.in(handlers.list);
                    
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
                    
                    // var applyArgs = [];
                    
                    var alreadyNext = false;
                    
                    var next = function() {
                        if (!alreadyNext) {
                            alreadyNext = true;
                            if (callback) callback();
                        }
                    };
                    
                    // applyArgs.push(superhandler);
                    
                    // if (!superhandler.options.sync) applyArgs.push(next);
                    
                    // applyArgs.push.apply(applyArgs, args);
                    
                    if (!superhandler.options.sync) {
                        superhandler.method.apply({
                            next: next,
                            superhandler: superhandler
                        }, args);
                    } else {
                        superhandler.method.apply({
                            superhandler: superhandler
                        }, args);
                        next();
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
                    
                    this.list.each(function(superposition, position) {
                        superposition.value.trigger(args, this.next);
                    }, {callback: callback});
                    
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
                    
                    this.list.append(superhandler.super);
                    
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
                
                // X // type.new
                var Item = function() {};
                
                // (types... Type)
                // => Boolean
                Item.prototype.of = function() {
                    
                    var prototypes = this.__type.__prototypes();
                    
                    for (var a in arguments) {
                        var found = false;
                        
                        for (var p in prototypes.all) {
                            if (prototypes.all[p] instanceof typing.Type) {
                                if (prototypes.all[p].id == arguments[a].id) found = true;
                            }
                        }
                        
                        if (!found) return false;
                    }
                    
                    return true;
                    
                };
                
                return Item;
                
            })();
            
            typing.Prototypes = (function(typing) {
                
                // ()
                var Prototypes = function() {
                    this.list = new lists.List;
                };
                
                // (prototypes... Item)
                Prototypes.prototype.include = function() {
                    
                    var args = [];
                    
                    for (var a in arguments) {
                        if (arguments[a] instanceof typing.Item || arguments[a] instanceof typing.Type) {
                            args.push(arguments[a].__super);
                        }
                    }
                    
                    this.list.append.apply(this.list, args);
                    
                };
                
                // (prototypes... Item)
                Prototypes.prototype.exclude = function() {
                    
                    var args = [];
                    
                    for (var a in arguments) {
                        if (arguments[a] instanceof typing.Item || arguments[a] instanceof typing.Type) {
                            args.push(arguments[a].__super);
                        }
                    }
                    
                    this.list.remove.apply(this.list, args);
                    
                };
                
                // (handler Function⎨, options { sync Boolean, reverse Boolean, callback Function }⎬)
                Prototypes.prototype.each = function(handler, options) {
                    
                    this.list.each(function(superposition, position) {
                        this.prototype = superposition.value
                        handler.call(this, superposition.value, superposition, position);
                        
                        if (this.next) this.next();
                    }, options);
                    
                };
                
                return Prototypes;
                
            })(typing);
            
            typing.Type = (function(Item, Prototypes) {
                
                var id = 0;
                
                // X // Type.inherit
                var Type = function() {
                    this.id = id++;
                    
                    this.prototype = {};
                    this.constructor = undefined;
                    this.inheritor = undefined;
                    this.creator = undefined;
                    
                    this.prototypes = new Prototypes
                };
                
                // (results { all: [Item, Type] }, now Item/Type)
                var __prototypes = function(results, now) {
                    
                    if (now instanceof Item) {
                        __prototypes(results, now.__type);
                        
                        results.all.push(now);
                        
                    } else if (now instanceof Type) {
                        
                        if (!results.types[now.id]) {
                            results.types[now.id] = now;
                            
                            now.prototypes.each(function(prototype) {
                                if (prototype) __prototypes(results, prototype);
                            }, { sync: true })
                            
                            results.all.push(now);
                        }
                    }
                    
                };
                
                // ()
                // => { all: [Item, Type], types: { id: Type } }
                Type.prototype.__prototypes = function() {
                    
                    var results = {
                        all: [], types: {}
                    }
                    
                    __prototypes(results, this);
                    
                    return results;
                    
                };
                
                // (attr Array⎨, callback.apply(item, attr) Function⎬)
                // => item Item
                // 'new' (attr...)
                // .constructor.apply(item, attr, item, item.__type);
                Type.prototype.new = function(attr, callback) {
                    
                    var type = this;
                    
                    var prototypes = type.__prototypes();
                    
                    // prototype
                    var Prototype = function() {};
                    
                    Prototype.prototype = new Item;
                    
                    lodash.extend(Prototype.prototype, new events.Emitter);
                    lodash.extend(Prototype.prototype, events.Emitter.prototype);
                    
                    lodash.extend(Prototype.prototype, type.prototype);
                    
                    for (var p in prototypes.all) {
                        if (prototypes.all[p] instanceof Item) {
                            lodash.extend(Prototype.prototype, prototypes.all[p]);
                        } else if (prototypes.all[p] instanceof Type) {
                            lodash.extend(Prototype.prototype, prototypes.all[p].prototype);
                            if (lodash.isFunction(prototypes.all[p].creator)) {
                                prototypes.all[p].creator.call(Prototype.prototype, Prototype.prototype, type, prototypes);
                            }
                        }
                    }
                    
                    // Hidden varibles
                    
                    Prototype.prototype.__type = type;
                    
                    // superposition
                    var superposition = new lists.Superposition;
                    
                    // superposition to prototype
                    Prototype.prototype.__super = superposition;
                    
                    // constructor
                    var item = new Prototype;
                    
                    // prototype to superposition
                    superposition.value = item;
                    
                    for (var p in prototypes.all) {
                        if (prototypes.all[p] instanceof Type) {
                            if (lodash.isFunction(prototypes.all[p].inheritor)) {
                                prototypes.all[p].inheritor.call(item, item, item.__type, prototypes);
                            }
                        }
                    }
                    
                    if (lodash.isFunction(this.constructor)) this.constructor.call(item, attr, item, item.__type, prototypes);
                    
                    // events
                    async.nextTick(function() {
                        type.trigger('new', attr, callback);
                    });
                    
                    return item;
                };
                
                // ()
                // => type Type
                Type.prototype.inherit = function() {
                    var type = Type.inherit();
                    
                    return type;
                };
                
                // ()
                // => type Type
                Type.inherit = function() {
                    
                    var Prototype = function() {};
                    
                    Prototype.prototype = new Type;
                    
                    lodash.extend(Prototype.prototype, new events.Emitter);
                    lodash.extend(Prototype.prototype, events.Emitter.prototype);
                    
                    // Hidden varibles
                    
                    // superposition
                    var superposition = new lists.Superposition;
                    
                    // superposition to prototype
                    Prototype.prototype.__super = superposition;
                    
                    var type = new Prototype;
                    
                    // prototype to superposition
                    superposition.value = type;
                    
                    return type;
                };
                
                return Type;
                
            })(typing.Item, typing.Prototypes);
            
            return typing;
            
        })(blackstone.events, blackstone.lists);
        
        // Blackstone Typing Lists
        (function() {
            
            // ()
            var toNative = function(list, arguments) {
                var args = [];
                
                for (var a in arguments) {
                    if (arguments[a] instanceof blackstone.typing.Item, arguments[a].of(blackstone.Superposition)) {
                        arguments[a].in(list);
                        args.push(arguments[a].__native);
                    }
                }
                
                return args;
            };
            
            // + blackstone.Superposition
            blackstone.Position = (function(typing) {
                
                var Position = typing.Type.inherit();
                
                Position.constructor = function(native) {
                    this.__native = native;
                    this.__native.value = this;
                };
                
                Position.creator = function(prototype) {
                    
                    // Safe // start
                    // ()
                    prototype.remove = function() {
                        return this.__native.remove();
                    };
                    
                    // (superpositions... Superposition)
                    prototype.append = function() {
                        return this.__native.append.apply(this.__native, toNative(this.list(), arguments));
                    };
                    
                    // (superpositions... Superposition)
                    prototype.prepend = function() {
                        return this.__native.prepend.apply(this.__native, toNative(this.list(), arguments));
                    };
                    
                    prototype.prev = function() {
                        return this.__native.prev.value;
                    };
                    
                    prototype.next = function() {
                        return this.__native.next.value;
                    };
                    
                    prototype.list = function() {
                        return this.__native.list.value;
                    };
                    
                    prototype.super = function() {
                        return this.__native.super.value;
                    };
                };
                
                return Position;
                
            })(blackstone.typing);
            
            // + blackstone.List
            blackstone.Superposition = (function(lists, typing, Position) {
                
                var Superposition = typing.Type.inherit();
                
                Superposition.constructor = function() {
                    this.__native = new lists.Superposition;
                    this.__native.value = this;
                };
                
                Superposition.creator = function(prototype) {
                    
                    // (list List)
                    prototype.in = function(list) {
                        var _position = undefined;
                        var position = undefined;
                        
                        if (list instanceof typing.Item && list.of(blackstone.List)) _position = this.__native.in(list.__list);
                        else if (list instanceof lists.List) _position = this.__native.in(list);
                        
                        if (_position) {
                            if (!_position.value) {
                                _position.value = Position.new(_position);
                            }
                            return _position.value;
                        } else return undefined;
                    };
                    
                };
                
                return Superposition;
                
            })(blackstone.lists, blackstone.typing, blackstone.Position);
            
            blackstone.List = (function(lists, typing, Superposition) {
                
                var List = typing.Type.inherit();
                
                List.constructor = function() {
                    this.__list = new lists.List;
                    this.__list.value = this;
                };
                
                List.creator = function(prototype, type, prototypes) {
                    
                    // (superpositions... Superposition)
                    prototype.remove = function() {
                        return this.__list.remove.apply(this.__list, toNative(this, arguments));
                    };
                    
                    // (superpositions... Superposition)
                    prototype.append = function() {
                        return this.__list.append.apply(this.__list, toNative(this, arguments));
                    };
                    
                    // (superpositions... Superposition)
                    prototype.prepend = function() {
                        return this.__list.prepend.apply(this.__list, toNative(this, arguments));
                    };
                    
                    // (handler Function⎨, options { sync Boolean, reverse Boolean, callback Function }⎬)
                    prototype.each = function(handler, options) {
                        
                        this.__list.each(function(native, position) {
                            this.native = native;
                            this.superposition = native.value;
                            handler.call(this, this.superposition, native, position);
                            
                            if (this.next) this.next();
                        }, options);
                        
                    };
                    
                    prototype.first = function() {
                        return this.__list.first? this.__list.first.value : undefined
                    };
                    
                    prototype.last = function() {
                        return this.__list.last? this.__list.last.value : undefined
                    };
                    
                    prototype.length = function() {
                        return this.__list.length;
                    };
                };
                
                return List;
                
            })(blackstone.lists, blackstone.typing, blackstone.Superposition);
            
        })();
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