// blackstone:develop
// https://github.com/isglazunov/blackstone/tree/develop

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
                        if (arguments[s] instanceof lists.Superposition) {
                            arguments[s].in(this).remove();
                        }
                    }
                    
                    return this.length;
                };
                
                // (superpositions... Superposition)
                List.prototype.append = function() {
                    
                    if (arguments.length > 0) {
                        for (var s = 0; s < arguments.length; s++) {
                            if (arguments[s] instanceof lists.Superposition) {
                                var pos = arguments[s].in(this);
                                
                                if (pos.exists) continue;
                                
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
                    }
                    
                    return this.length;
                };
                
                // (superpositions... Superposition)
                List.prototype.prepend = function() {
                    
                    if (arguments.length > 0) {
                        for (var s = arguments.length - 1; s > 0-1; s--) {
                            if (arguments[s] instanceof lists.Superposition) {
                                var pos = arguments[s].in(this);
                                
                                if (pos.exists) continue;
                                
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
                    }
                    
                    return this.length;
                };
                
                // (handler.call({ position, super, list, ~ next }, super Superposition, position Position, list List) Function⎨, options { sync Boolean, reverse Boolean, callback() Function }⎬)
                List.prototype.each = function(handler, _options) {
                    
                    var list = this;
                    
                    if (!lodash.isObject(_options)) var _options = {};
                    
                    var options = lodash.defaults(_options, {
                        sync: false,
                        reverse: false,
                        callback: undefined
                    });
                    
                    var callback = options.callback? options.callback : function() {};
                    
                    var position = undefined;
                    var future = undefined;
                    var move = undefined;
                    
                    if (!options.reverse) {
                        position = list.first;
                        if (position) future = position.next;
                        
                        move = function() {
                            position = position.next;
                            future = position.next;
                        };
                    } else {
                        position = list.last;
                        if (position) future = position.prev;
                        
                        move = function() {
                            position = position.prev;
                            future = position.prev;
                        };
                    }
                    
                    var next = function() {
                        if (future) {
                            move();
                            iteration();
                        } else callback();
                    };
                    
                    if (!options.sync) {
                        var iteration = function() {
                            
                            handler.call({
                                position: position,
                                super: position.super,
                                list: list,
                                next: lodash.once(next)
                            }, position.super, position, list);
                        };
                    } else {
                        var iteration = function() {
                            handler.call({
                                position: position,
                                super: position.super,
                                list: list
                            }, position.super, position, list);
                            
                            if (future) next();
                            else callback();
                        };
                    }
                    
                    if (list.length > 0) iteration();
                    else callback();
                    
                };
                
                // (comparator.call({ next(Boolean) Function }, source Superposition, target Superposition) Function, callback Function⎨, handler Function⎬)
                List.prototype.sort = function(comparator, callback, handler) {
                    var list = this;
                    
                    var handle = handler? function() { handler.apply(handler, arguments); } : function() {}
                    var result = function() { callback(); };
                    
                    if (list.first) {
                        
                        if (list.first.next) {
                            
                            list.first.next.travel(function(pos) {
                                var travel = this;
                                
                                var next = pos.next;
                                
                                pos.__sort(comparator, function(moved) {
                                    handle(pos, moved);
                                    
                                    if (next) travel.next(next);
                                    else result();
                                });
                                
                            });
                            
                        } else result();
                        
                    } else result();
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
                
                // Find position for position in prevs
                // (comparator Function, callback Function)
                Position.prototype.__compare = function(comparator, callback) {
                    var target = this;
                    
                    var parent = target.prev;
                    var edge = false;
                    var moved = false;
                    
                    var result = function() {
                        callback(parent, edge, moved);
                    };
                    
                    if (target.list.first.id == target.id) {
                        edge = true;
                        result();
                    } else {
                        target.prev.travel(function(source) {
                            var travel = this;
                            
                            comparator.call({ next: function(response) {
                                parent = source;
                                
                                if (response) {
                                    result();
                                    
                                } else {
                                    moved = true;
                                    
                                    if (source.prev) travel.next(source.prev);
                                    else {
                                        edge = true;
                                        result();
                                    }
                                }
                            } }, source.super, target.super);
                        });
                    }
                };
                
                // Sort position in prevs
                // (comparator Function, callback Function)
                Position.prototype.__sort = function(comparator, callback) {
                    var target = this;
                    var list = target.list;
                    
                    var result = function() { callback(target) };
                    
                    target.__compare(comparator, function(parent, edge, moved) {
                        if (moved) {
                            target.remove();
                            if (edge) {
                                list.prepend(target.super);
                            } else {
                                parent.append(target.super);
                            }
                        }
                        result(moved);
                    });
                };
                
                // Unsafe // end
                
                // Safe // start
                // ()
                // => this.list.length
                Position.prototype.remove = function() {
                    if (this.exists) {
                        this.list.__remove(this);
                        this.__remove();
                        this.exists = false;
                    }
                    return this.list.length;
                };
                
                // (superpositions... Superposition)
                // => this.list.length
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
                // => this.list.length
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
                    
                // (handler( ~ { next(direction Superposition/Position) Function }, position Position) Function)
                Position.prototype.travel = function(handler) {
                    var position = this;
                    
                    handler.call({ next: function(direction) {
                        
                        if (!direction instanceof Position) throw new Error('direction is not a position');
                        
                        direction.travel(handler);
                        
                    } }, position);
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
                    }, { callback: function() {
                        if (callback) callback();
                    } });
                    
                };
                
                // (handler Function⎨, options Object⎬) ~ adapter
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
                
                // (name String)
                // => handlers Handlers
                Emitter.prototype.__event = function(name) {
                    if (!this.__handlers[name]) this.__handlers[name] = new Handlers;
                    
                    return this.__handlers[name];
                };
                
                // (name String, args Array⎨, callback Function⎬)
                Emitter.prototype.trigger = function(name, args, callback) {
                    
                    this.__event(name).trigger(args, callback);
                    
                };
                
                // (name String, handler Function⎨, options Object⎬) ~ adapter
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
                        
                        if (this.__type.id == arguments[a].id) { // this type
                            found = true;
                            
                        } else { // this type types
                            for (var p in prototypes.all) {
                                if (prototypes.all[p] instanceof typing.Type) {
                                    if (prototypes.all[p].id == arguments[a].id) {
                                        found = true;
                                        break;
                                    }
                                }
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
                        if (arguments[a] instanceof typing.Type) {
                            args.push(arguments[a].__super);
                        } else throw new TypeError('should be instanceof Type');
                    }
                    
                    this.list.append.apply(this.list, args);
                    
                };
                
                // (prototypes... Item)
                Prototypes.prototype.exclude = function() {
                    
                    var args = [];
                    
                    for (var a in arguments) {
                        if (arguments[a] instanceof typing.Type) {
                            args.push(arguments[a].__super);
                        } else throw new TypeError('should be instanceof Type');
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
                    
                    // .call(item Item, attr Object, item Item, prototype Object, typePrototype Object, typesPrototype Object, type Type, prototypes { all: [Type], types: { id: Type } })
                    this.constructor = undefined;
                    
                    // .call(item Item, item Item, prototype Object, typePrototype Object, typesPrototype Object, type Type, prototypes { all: [Type], types: { id: Type } })
                    this.inheritor = undefined;
                    
                    // .call(prototype Object, prototype Object, typePrototype Object, typesPrototype Object, type Type, prototypes { all: [Type], types: { id: Type } })
                    this.creator = undefined;
                    
                    this.prototypes = new Prototypes
                };
                
                // (results { all: [Type] }, now Item/Type, notThis = false)
                var __prototypes = function(results, now, notThis) {
                    
                    if (now instanceof Type) {
                        
                        if (!results.types[now.id]) {
                            if (!notThis) results.types[now.id] = now;
                            
                            now.prototypes.each(function(prototype) {
                                if (prototype) __prototypes(results, prototype);
                            }, { sync: true })
                            
                            if (!notThis) results.all.push(now);
                        }
                    }
                    
                };
                
                // (notThis = true Boolean)
                // => { all: [Type], types: { id: Type } }
                Type.prototype.__prototypes = function(notThis) {
                    
                    if (!lodash.isBoolean(notThis)) var notThis = true;
                    
                    var results = {
                        all: [], types: {}
                    }
                    
                    __prototypes(results, this, notThis);
                    
                    return results;
                    
                };
                
                // (attr Array⎨, callback.call(item, attr Object, item Item, prototype Object, typePrototype Object, typesPrototype Object, type Type, prototypes { all: [Type], types: { id: Type } }) Function⎬)
                // .constructor.call(item Item, attr Object, item Item, prototype Object, typePrototype Object, typesPrototype Object, type Type, prototypes { all: [Type], types: { id: Type } })
                // 'new' (attr Object, item Item, prototype Object, typePrototype Object, typesPrototype Object, type Type, prototypes { all: [Type], types: { id: Type } })
                // => item Item
                Type.prototype.new = function(attr, callback) {
                    
                    var type = this;
                    
                    var prototypes = type.__prototypes();
                    
                    // prototype // start
                    
                    // __prototype // start
                    
                    var __prototype = {};
                    
                    lodash.extend(__prototype, new events.Emitter);
                    lodash.extend(__prototype, events.Emitter.prototype);
                    
                    lodash.extend(__prototype, type.prototype);
                    
                    __prototype.__type = type;
                    
                    // __super // start
                    
                    var superposition = new lists.Superposition;
                    __prototype.__super = superposition;
                    
                    // __super // end
                    
                    // __prototype // end
                    
                    // __prototypes // start
                    
                    var __prototypes = {};
                    
                    for (var p in prototypes.all) {
                        if (prototypes.all[p] instanceof Type) {
                            lodash.extend(__prototypes, prototypes.all[p].prototype);
                        }
                    }
                    
                    // __prototypes // end
                    
                    var Prototype = function() {};
                    
                    Prototype.prototype = new Item;
                    
                    lodash.extend(Prototype.prototype, __prototypes);
                    lodash.extend(Prototype.prototype, __prototype);
                    
                    // creators // start
                    
                    if (lodash.isFunction(type.creator)) {
                        type.creator.call(Prototype.prototype, Prototype.prototype, __prototype, __prototypes, type, prototypes);
                    }
                    
                    for (var p in prototypes.all) {
                        if (prototypes.all[p] instanceof Type) {
                            if (lodash.isFunction(prototypes.all[p].creator)) {
                                prototypes.all[p].creator.call(Prototype.prototype, Prototype.prototype, __prototype, __prototypes, type, prototypes);
                            }
                        }
                    }
                    
                    // creators // end
                    
                    // prototype // end
                    
                    // constructor
                    var item = new Prototype;
                    
                    // prototype to superposition
                    superposition.value = item;
                    
                    for (var p in prototypes.all) {
                        if (prototypes.all[p] instanceof Type) {
                            if (lodash.isFunction(prototypes.all[p].inheritor)) {
                                prototypes.all[p].inheritor.call(item, item, Prototype.prototype, __prototype, __prototypes, item.__type, prototypes);
                            }
                        }
                    }
                    
                    if (lodash.isFunction(this.constructor)) this.constructor.call(item, attr, item, Prototype.prototype, __prototype, __prototypes, item.__type, prototypes);
                    
                    // events
                    async.nextTick(function() {
                        type.trigger('new', [attr, item, Prototype.prototype, __prototype, __prototypes, item.__type, prototypes], callback);
                    });
                    
                    // callback
                    if (callback) callback.call(item, attr, item, Prototype.prototype, __prototype, __prototypes, item.__type, prototypes);
                    
                    return item;
                };
                
                // ()
                // => type Type
                Type.prototype.inherit = function() {
                    var type = Type.inherit();
                    
                    type.prototypes.include(this);
                    
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
        blackstone.Typing = (function(typing, lists) {
            
            // (list List, superpositions[Superposition] Array)
            // => { native: [typing.Position], typing: [Position] }
            var parse = (function(Item) {
                return function(list, arguments) {
                    var result = {
                        native: [],
                        typing: []
                    };
                    
                    for (var a in arguments) {
                        if (arguments[a] instanceof Item && arguments[a].of(Typing.Superposition)) {
                            arguments[a].in(list);
                            result.native.push(arguments[a].__native);
                            result.typing.push(arguments[a]);
                        }
                    }
                    
                    return result;
                };
            })(typing.Item);
            
            var Typing = {};
            
            Typing.Position = (function(Type, Item, parse) {
                
                var Position = Type.inherit();
                
                // (native typing.Position)
                Position.constructor = function(native) {
                    
                    // Mutual binding
                    if (!this.__native) {
                        this.__native = native;
                        this.__native.value = this;
                    }
                };
                    
                var __removeEvents = function(position, callback) {
                    async.series([
                        function(next) { position.trigger('remove', [position], next); },
                        function(next) { position.super().trigger('remove', [position], next); },
                        function(next) { position.list().trigger('remove', [position], next); },
                    ], function() {
                        callback();
                    });
                };
                
                // ([callback.call(position Position, position Position) Function])
                // position 'remove' (position Position)
                // position.super 'remove' (position Position)
                // position.list 'remove' (position Position)
                // callback.call(position Position, position Position)
                // => position.length()
                Position.prototype.remove = function(callback) {
                    
                    var position = this;
                    
                    var nativeResult = this.__native.remove();
                    
                    __removeEvents(position, function() {
                        if (callback) callback.call(position, position);
                    });
                    
                    return nativeResult;
                };
                
                var __appendAndPrependEvents = function(event, isEdge, position, typing, callback) {
                    var series = [];
                    
                    series.push(function(next) { position.trigger(event, typing, next); });
                    series.push(function(next) { position.trigger('add', typing, next); });
                    
                    series.push(function(next) { position.super().trigger(event, [position, typing], next); });
                    series.push(function(next) { position.super().trigger('add', [position, typing], next); });
                    
                    if (isEdge) series.push(function(next) { position.list().trigger(event, typing, next); });
                    series.push(function(next) { position.list().trigger('add', typing, next); });
                    
                    async.series(series, function() {
                        callback();
                    });
                };
                
                var __appendEvents = function(isEdge, position, typing, callback) { __appendAndPrependEvents('append', isEdge, position, typing, callback); };
                
                var __prependEvents = function(isEdge, position, typing, callback) { __appendAndPrependEvents('prepend', isEdge, position, typing, callback); };
                
                // (superpositions... Superposition⎨, callback.call(position Position, superpositions... Superposition) Function⎬)
                // position 'append' (superpositions... Superposition)
                // position 'add' (superpositions... Superposition)
                // position.super 'append' (position Position, superpositions[Superposition] Array)
                // position.super 'add' (position Position, superpositions[Superposition] Array)
                // ~ position.list 'append' (superpositions... Superposition)
                // position.list 'add' (superpositions... Superposition)
                // callback.call(position Position, superpositions... Superposition)
                // => position.length()
                Position.prototype.append = function() {
                    var position = this;
                    
                    var callback = lodash.isFunction(arguments[arguments.length - 1])? arguments[arguments.length - 1] : undefined;
                    
                    var parsed = parse(this.list(), arguments);
                    
                    var isLast = position.list().last().__native.id == position.__native.id;
                    
                    var nativeResult = this.__native.append.apply(this.__native, parsed.native);
                    
                    __appendEvents(isLast, position, parsed.typing, function() {
                        if (callback) callback.apply(position, parsed.typing);
                    });
                    
                    return nativeResult;
                };
                
                // (superpositions... Superposition⎨, callback.call(position Position, superpositions... Superposition) Function⎬)
                // position 'prepend' (superpositions... Superposition)
                // position.super 'prepend' (position Position, superpositions[Superposition] Array)
                // position.super 'add' (position Position, superpositions[Superposition] Array)
                // ~ position.list 'prepend' (superpositions... Superposition)
                // position.list 'add' (superpositions... Superposition)
                // callback.call(position Position, superpositions... Superposition)
                // => position.length()
                Position.prototype.prepend = function() {
                    var position = this;
                    
                    var callback = lodash.isFunction(arguments[arguments.length - 1])? arguments[arguments.length - 1] : undefined;
                    
                    var parsed = parse(this.list(), arguments);
                    
                    var isFirst = position.list().first().__native.id == position.__native.id;
                    
                    var nativeResult = this.__native.prepend.apply(this.__native, parsed.native);
                    
                    __prependEvents(isFirst, position, parsed.typing, function() {
                        if (callback) callback.apply(position, parsed.typing);
                    });
                    
                    return nativeResult;
                };
                
                // (cursor Superposition/Position⎨, callback.call(position Position, cursor Superposition) Function⎬)
                // ~ position 'remove' (position Position)
                // ~ position.super 'remove' (position Position)
                // ~ position.list 'remove' (position Position)
                // cursor Position 'prepend' (superpositions... Superposition)
                // cursor Superposition 'prepend' (cursor Position, superpositions[Superposition] Array)
                // cursor Superposition 'add' (cursor Position, superpositions[Superposition] Array)
                // ~ cursor.list 'prepend' (superpositions... Superposition)
                // cursor.list 'add' (superpositions... Superposition)
                // position 'before' (cursor Superposition)
                // position 'move' (cursor Superposition)
                // callback.call(position Position, cursor Superposition)
                Position.prototype.before = function(_cursor, callback) {
                    var position = this;
                    
                    // Cursor // start
                    
                    if (_cursor instanceof Item) {
                        if (_cursor.of(Typing.Superposition)) {
                            var cursor = _cursor;
                        } else if (_cursor.of(Typing.Position)) {
                            var cursor = _cursor.super();
                        }
                    } else throw new Error('cursor is not a item');
                    
                    if (!cursor.in(this.list()).exists()) throw new Error('cursor is not exists');
                    
                    var cursorPosition = cursor.in(position.list());
                    
                    // Cursor // end
                    
                    var exists = position.exists();
                    var isSelf = false;
                    
                    if (position.__native.id == cursorPosition.__native.id) {
                        isSelf = true;
                    }
                    
                    var series = [];
                    
                    if (!isSelf) {
                        if (exists) position.__native.remove();
                        
                        // Prepend this to cursor
                        var isFirst = position.list().first().__native.id == cursorPosition.__native.id;
                        cursorPosition.__native.prepend(position.super().__native);
                        
                        if (exists) series.push(function(next) { __removeEvents(position, next); });
                        
                        series.push(function(next) { __appendEvents(isFirst, cursorPosition, [position.super()], next); });
                        series.push(function(next) { position.trigger('before', [cursor], next); });
                        series.push(function(next) { position.super().trigger('before', [position, cursor], next); });
                        series.push(function(next) { position.trigger('move', [cursor], next); });
                        series.push(function(next) { position.super().trigger('move', [position, cursor], next); });
                    }
                    
                    async.series(series, function() {
                        if (callback) callback.call(position, cursor);
                    });
                };
                
                // (cursor Superposition/Position⎨, callback.call(position Position, cursor Superposition) Function⎬)
                // ~ position 'remove' (position Position)
                // ~ position.super 'remove' (position Position)
                // ~ position.list 'remove' (position Position)
                // cursor Position 'append' (superpositions... Superposition)
                // cursor Superposition 'append' (cursor Position, superpositions[Superposition] Array)
                // cursor Superposition 'add' (cursor Position, superpositions[Superposition] Array)
                // ~ cursor.list 'append' (superpositions... Superposition)
                // cursor.list 'add' (superpositions... Superposition)
                // position 'before' (cursor Superposition)
                // position.super 'before' (position Position, cursor Superposition)
                // position 'move' (cursor Superposition)
                // position.super 'move' (position Position, cursor Superposition)
                // callback.call(position Position, cursor Superposition)
                Position.prototype.after = function(_cursor, callback) {
                    var position = this;
                    
                    // Cursor // start
                    
                    if (_cursor instanceof Item) {
                        if (_cursor.of(Typing.Superposition)) {
                            var cursor = _cursor;
                        } else if (_cursor.of(Typing.Position)) {
                            var cursor = _cursor.super();
                        }
                    } else throw new Error('cursor is not a item');
                    
                    if (!cursor.in(this.list()).exists()) throw new Error('cursor is not exists');
                    
                    var cursorPosition = cursor.in(position.list());
                    
                    // Cursor // end
                    
                    var exists = position.exists();
                    var isSelf = false;
                    
                    if (position.__native.id == cursorPosition.__native.id) {
                        isSelf = true;
                    }
                    
                    var series = [];
                    
                    if (!isSelf) {
                        if (exists) position.__native.remove();
                        
                        // Prepend this to cursor
                        var isLast = position.list().last().__native.id == cursorPosition.__native.id;
                        cursorPosition.__native.append(position.super().__native);
                        
                        if (exists) series.push(function(next) { __removeEvents(position, next); });
                        
                        series.push(function(next) { __appendEvents(isLast, cursorPosition, [position.super()], next); });
                        series.push(function(next) { position.trigger('after', [cursor], next); });
                        series.push(function(next) { position.super().trigger('after', [position, cursor], next); });
                        series.push(function(next) { position.trigger('move', [cursor], next); });
                        series.push(function(next) { position.super().trigger('move', [position, cursor], next); });
                    }
                    
                    async.series(series, function() {
                        if (callback) callback.call(position, cursor);
                    });
                };
                
                // (handler( ~ { next(direction Superposition/Position) Function }, position Position) Function)
                Position.prototype.travel = function(handler) {
                    var position = this;
                    
                    position.__native.travel(function(pos) {
                        
                        var travel = this;
                        
                        handler.call({ next: function(_direction) {
                            
                            if (_direction instanceof Item) {
                                if (_direction.of(Typing.Superposition)) {
                                    var direction = _direction.in(position.list());
                                } else if (_direction.of(Typing.Position)) {
                                    var direction = _direction.super().in(position.list());
                                }
                            } else throw new Error('direction is not a item');
                            
                            travel.next(direction.__native);
                            
                        } }, pos.value);
                        
                    });
                };
                
                // => prev position Position
                Position.prototype.prev = function() {
                    return this.__native.prev? this.__native.prev.value : this.__native.prev
                };
                
                // => next position Position
                Position.prototype.next = function() {
                    return this.__native.next? this.__native.next.value : this.__native.next
                };
                
                // => position list List
                Position.prototype.list = function() {
                    return this.__native.list.value;
                };
                
                // => position super Superposition
                Position.prototype.super = function() {
                    return this.__native.super? this.__native.super.value : this.__native.super
                };
                
                // => Boolean
                Position.prototype.exists = function() {
                    return this.__native.exists;
                };
                
                return Position;
                
            })(typing.Type, typing.Item, parse);
            
            Typing.Superposition = (function(Type, Item, lists) {
                
                var Superposition = Type.inherit();
                
                // ()
                Superposition.constructor = function() {
                    
                    // Mutual binding
                    if (!this.__native) {
                        this.__native = new lists.Superposition;
                        this.__native.value = this;
                    }
                };
                    
                // (list List)
                // => position Position
                Superposition.prototype.in = function(list) {
                    var nativeList = list instanceof lists.List? list : list instanceof Item && list.of(Typing.List)? list.__native : undefined
                    
                    if (!nativeList) return undefined;
                    
                    var nativePosition = this.__native.in(nativeList);
                    
                    // Mutual position binding
                    if (!nativePosition.value) nativePosition.value = Typing.Position.new(nativePosition);
                    
                    return nativePosition.value;
                };
                
                return Superposition;
                
            })(typing.Type, typing.Item, lists);
            
            Typing.List = (function(Type, Item) {
                
                var List = Type.inherit();
                
                // ()
                List.constructor = List.inheritor = function() {
                    
                    // Mutual binding
                    if (!this.__native) {
                        this.__native = new lists.List;
                        this.__native.value = this;
                    }
                    
                    if (!this.comparator) this.comparator = undefined;
                };
                    
                // (superpositions... Superposition⎨, callback(superpositions... Superposition) Function⎬)
                // position 'remove' (position Position)
                // superposition 'remove' (position Position)
                // list 'remove' (position Position)
                // ~ callback.apply(list, superpositions... Superposition)
                // => list.length();
                List.prototype.remove = function() {
                    var list = this;
                    
                    var callback = lodash.isFunction(arguments[arguments.length - 1])? arguments[arguments.length - 1] : undefined;
                    
                    var parsed = parse(this, arguments);
                    
                    for (var t in parsed.typing) {
                        parsed.typing[t].in(list).remove();
                    }
                    
                    if (callback) callback.apply(list, parsed.typing);
                    
                    return list.length();
                };
                
                // (superpositions... Superposition⎨, callback(superpositions... Superposition) Function⎬)
                // ~ position 'append' (superpositions... Superposition)
                // ~ superposition 'append' (position Position, superpositions[Superposition] Array)
                // ~ superposition 'add' (position Position, superpositions[Superposition] Array)
                // list 'append' (superpositions... Superposition)
                // list 'add' (superpositions... Superposition)
                // callbac.apply(list, superpositions... Superposition)
                // => position.length()
                List.prototype.append = function() {
                    var list = this;
                    
                    var callback = lodash.isFunction(arguments[arguments.length - 1])? arguments[arguments.length - 1] : undefined;
                    
                    var parsed = parse(this, arguments);
                    
                    var last = list.last();
                    
                    list.__native.append.apply(list.__native, parsed.native);
                    
                    var series = [];
                    
                    if (last) {
                        series.push(function(next) { last.trigger('append', parsed.typing, next); });
                        series.push(function(next) { last.super().trigger('append', [last, parsed.typing], next); });
                        series.push(function(next) { last.super().trigger('add', [last, parsed.typing], next); });
                    }
                    
                    series.push(function(next) { list.trigger('append', parsed.typing, next); });
                    series.push(function(next) { list.trigger('add', parsed.typing, next); });
                    
                    async.series(series, function() {
                        if (callback) callback.apply(list, parsed.typing);
                    });
                    
                    return list.length();
                };
                
                // (superpositions... Superposition⎨, callback(superpositions... Superposition) Function⎬)
                // ~ position 'prepend' (superpositions... Superposition)
                // ~ superposition 'prepend' (position Position, superpositions[Superposition] Array)
                // ~ superposition 'add' (position Position, superpositions[Superposition] Array)
                // list 'prepend' (superpositions... Superposition)
                // list 'add' (superpositions... Superposition)
                // callbac.apply(list, superpositions... Superposition)
                // => position.length()
                List.prototype.prepend = function() {
                    var list = this;
                    
                    var callback = lodash.isFunction(arguments[arguments.length - 1])? arguments[arguments.length - 1] : undefined;
                    
                    var parsed = parse(this, arguments);
                    
                    var first = list.first();
                    
                    list.__native.prepend.apply(list.__native, parsed.native);
                    
                    var series = [];
                    
                    if (first) {
                        series.push(function(next) { first.trigger('prepend', parsed.typing, next); });
                        series.push(function(next) { first.super().trigger('prepend', [first, parsed.typing], next); });
                        series.push(function(next) { first.super().trigger('add', [first, parsed.typing], next); });
                    }
                    
                    series.push(function(next) { list.trigger('prepend', parsed.typing, next); });
                    series.push(function(next) { list.trigger('add', parsed.typing, next); });
                    
                    async.series(series, function() {
                        if (callback) callback.apply(list, parsed.typing);
                    });
                    
                    return list.length();
                };
                
                // (handler.call(~ { native lists.Superposition, super Superposition, position Position }, superposition Superposition, position Position) Function⎨, options Object⎬) ~ adapter
                List.prototype.each = function(handler, options) {
                    var list = this;
                    
                    this.__native.each(function(nativeSuperposition, nativePosition) {
                        var context = this;
                        
                        context.native = nativeSuperposition;
                        
                        var superposition = nativeSuperposition.value;
                        context.super = superposition;
                        
                        var position = nativePosition.value;
                        context.position = position;
                        
                        context.list = list;
                        
                        handler.call(context, superposition, position);
                    }, options);
                    
                };
                
                // (comparator.call({ next(Boolean) Function }, source Superposition, target Superposition) Function, callback Function)
                // position 'sort' ()
                // list 'sort' ()
                List.prototype.sort = function(callback) {
                    var list = this;
                    
                    if (!list.comparator) throw new Error('Wrong comparator');
                    
                    list.__native.sort(function(source, target) {
                        list.comparator.call(this, source.value, target.value);
                        
                    }, function() {
                        
                        list.trigger('sort', [], function() {
                            if (callback) callback();
                        });
                        
                    });
                };
                
                List.prototype.first = function() {
                    return this.__native.first? this.__native.first.value : undefined
                };
                
                List.prototype.last = function() {
                    return this.__native.last? this.__native.last.value : undefined
                };
                
                List.prototype.length = function() {
                        return this.__native.length;
                    };
                
                return List;
                
            })(typing.Type, typing.Item);
            
            Typing.Data = (function(Type) {
                
                var Data = Type.inherit();
                
                Data.defaults = {};
                
                Data.constructor = Data.inheritor = function() {
                    if (!this.__data) this.__data = {};
                    
                    // The values will be supplanted when receiving data automatically.
                    if (!this.defaults) this.defaults = {};
                };
                
                // (⎨ options: { defaults: true, clone: true } ⎬)
                var __get = function(data, __data, options) {
                    
                    var options = lodash.defaults(
                        lodash.isObject(options)? options : {},
                        { defaults: true, clone: true }
                    );
                    
                    var result = __data;
                    
                    // Defaults
                    if (options.defaults) {
                        if (lodash.isObject(data.defaults) && !lodash.isEmpty(data.defaults)) {
                            result = lodash.defaults(__data, data.defaults);
                        }
                    }
                    
                    // Clone
                    if (options.clone) {
                        var result = lodash.cloneDeep(result);
                    }
                    
                    return result;
                };
                
                // (⎨ options ~ adapter⎨, callback Function ⎬⎬)
                // data 'get' (data)
                // callback (data)
                Data.prototype.get = function(options, callback) {
                    var self = this;
                    
                    return __get(self, self.__data, options);
                    
                    self.trigger('get', [data], function() {
                        if (callback) callback(data);
                    });
                };
                
                // (source Object⎨, callback(data, before) Function⎬)
                // data 'set' (data, before)
                // callback (data, before)
                Data.prototype.set = function(source, callback) {
                    var self = this;
                    
                    var before = __get(self, self.__data, { defaults: false, clone: true });
                    self.__data = lodash.cloneDeep(source);
                    var data = __get(self, self.__data);
                    
                    self.trigger('set', [data, before], function() {
                        if (callback) callback(data, before);
                    });
                };
                
                // (⎨callback(data, before) Function⎬)
                // data 'unset' (data, before)
                // data 'set' (data, before)
                // callback (data, before)
                Data.prototype.unset = function(callback) {
                    var self = this;
                    
                    var before = __get(self, self.__data, { defaults: false, clone: true });
                    self.__data = {};
                    var data = __get(self, self.__data);
                    
                    self.trigger('unset', [data, before], function() {
                        self.trigger('set', [data, before], function() {
                            if (callback) callback(data, before);
                        });
                    });
                };
                
                // (source Object⎨, callback(data, before) Function⎬)
                // data 'extend' (data, before)
                // data 'set' (data, before)
                // callback (data, before)
                Data.prototype.extend = function(source, callback) {
                    var self = this;
                    
                    var before = __get(self, self.__data, { defaults: false, clone: true });
                    lodash.extend(self.__data, source);
                    var data = __get(self, self.__data);
                    
                    self.trigger('extend', [data, before], function() {
                        self.trigger('set', [data, before], function() {
                            if (callback) callback(data, before);
                        });
                    });
                };
                
                // (source Object⎨, callback(data, before) Function⎬)
                // data 'merge' (data, before)
                // data 'set' (data, before)
                // callback (data, before)
                Data.prototype.merge = function(source, callback) {
                    var self = this;
                    
                    var before = __get(self, self.__data, { defaults: false, clone: true });
                    lodash.extend(self.__data, source);
                    var data = __get(self, self.__data);
                    
                    self.trigger('merge', [data, before], function() {
                        self.trigger('set', [data, before], function() {
                            if (callback) callback(data, before);
                        });
                    });
                };
                
                // (property String⎨, options ~ adapter⎨, callback Function ⎬⎬)
                // data 'has' (result Boolean, data)
                // data 'get' (data)
                // callback (result Boolean, data)
                // => Boolean
                Data.prototype.has = function(property, options, callback) {
                    var self = this;
                    
                    var data = __get(self, self.__data, options);
                    var result = lodash.has(data, property);
                    
                    self.trigger('has', [result, data], function() {
                        self.trigger('get', [data], function() {
                            if (callback) callback(result, data);
                        });
                    });
                    
                    return result;
                };
                
                // (⎨ options ~ adapter⎨, callback Function ⎬⎬⎬)
                // data 'keys' (keys[String] Array, data)
                // data 'get' (data)
                // callback (keys[String] Array, data)
                // => [String] Array
                Data.prototype.keys = function(options, callback) {
                    var self = this;
                    
                    var data = __get(self, self.__data, options);
                    var result = lodash.keys(data);
                    
                    self.trigger('keys', [result, data], function() {
                        self.trigger('get', [data], function() {
                            if (callback) callback(result, data);
                        });
                    });
                    
                    return result;
                };
                
                // (⎨ options ~ adapter⎨, callback Function ⎬⎬⎬)
                // data 'values' (keys Array, data)
                // data 'get' (data)
                // callback (keys Array, data)
                // => [String] Array
                Data.prototype.values = function(options, callback) {
                    var self = this;
                    
                    var data = __get(self, self.__data, options);
                    var result = lodash.values(data);
                    
                    self.trigger('keys', [result, data], function() {
                        self.trigger('get', [data], function() {
                            if (callback) callback(result, data);
                        });
                    });
                    
                    return result;
                };
                
                return Data;
                
            })(typing.Type);
            
            Typing.Sync = (function(Type) {
                
                var Sync = Type.inherit();
                
                // (query Object, options Object, callback Function)
                Sync.prototype.find = undefined;
                
                // (document Item:Document, options Object, callback Function)
                Sync.prototype.get = undefined;
                
                // (document Item:Document, options Object, callback Function)
                Sync.prototype.set = undefined;
                
                // (document Item:Document, options Object, callback Function)
                Sync.prototype.unset = undefined;
                
                return Sync;
                
            }(typing.Type);
            
            Typing.Documents = (function(Type) {
                
                var Documents = Type.inherit();
                
                Documents.prototypes.include(Typing.List); 
                
                return Documents;
                
            })(typing.Type);
            
            Typing.Document = (function(Type, Data) {
                
                var Document = Type.inherit();
                
                Document.prototypes.include(Data, Typing.Superposition);
                
                return Document;
                
            })(typing.Type, Typing.Data);
            
            return Typing;
            
        })(blackstone.typing, blackstone.lists);
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