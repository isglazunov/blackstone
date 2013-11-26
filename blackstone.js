// blackstone@0.0.14
// https://github.com/isglazunov/blackstone

// Help

// Uses the prefix __ to indicate the system variables. Use the system variables with the understanding!

// Module
(function() {
    
    // Blackstone Version
    // Version for internal use
    var __version = '0.0.14';
    
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
        
        // Tools // start
        
        // (condition, handler, options { sync = false Boolean, reverse = false Boolean, callback = undefined Function, native = false Boolean } Object)
        blackstone.cycle = function(condition, handler, _options) {
            
            if (this === true) {
                var options = _options;
            } else {
                if (!lodash.isObject(_options)) var _options = {};
                
                var options = lodash.defaults(_options, {
                    sync: false,
                    reverse: false,
                    callback: undefined,
                    native: false
                });
            }
            
            var callback = options.callback? options.callback : function() {};
            
            // condition(next(Boolean) Function) Function
            // handler.call({ next Function }) Function
            if (lodash.isFunction(condition)) {
                
                var handlerContext = {
                    next: function() {
                        iteration();
                    }
                };
                
                if (!options.sync) {
                    var conditionContext = {
                        next: function(response) {
                            if (response) handler.call(handlerContext);
                            else callback();
                        }
                    };
                } else {
                    var conditionContext = {
                        next: function(response) {
                            if (response) {
                                handler();
                                handlerContext.next();
                            } else callback();
                        }
                    };
                }
                
                var iteration = function() {
                    condition.call(conditionContext);
                };
                
                iteration();
                
            } else {
                
                // condition Array
                // handler.call({ next Function }, value, key) Function
                if(lodash.isArray(condition)) {
                    
                    if (!options.reverse) {
                        var key = 0;
                        
                        var conditionFunction = function() {
                            key++;
                            this.next(key < condition.length);
                        };
                    } else {
                        var key = condition.length - 1;
                        
                        var conditionFunction = function() {
                            key--;
                            this.next(key >= 0);
                        };
                    }
                    
                    blackstone.cycle.call(true, conditionFunction, function() {
                        handler.call(this, condition[key], key);
                    }, options);
                    
                } else if(lodash.isObject(condition)) {
                    
                    // condition List
                    // handler.call({ next Function }, superposition Superposition, position Position)
                    if (!options.native && condition instanceof blackstone.lists.List) {
                        
                        var now;
                        var temp = false;
                        
                        if (!options.reverse) {
                            var now = condition.first;
                            
                            var conditionFunction = function() {
                                if (!temp) temp = true;
                                else now = now.next;
                                
                                this.next(!!now);
                            };
                            
                        } else {
                            var now = condition.last;
                            
                            var conditionFunction = function() {
                                if (!temp) temp = true;
                                else now = now.prev;
                                
                                this.next(!!now);
                            };
                            
                        }
                        
                        blackstone.cycle.call(true, conditionFunction, function() {
                            handler.call(this, now.super, now);
                        }, options);
                        
                    // condition Item:List
                    // handler.call({ next Function }, superposition Item:Superposition, position Item:Position) Function
                    } else if (!options.native && condition instanceof blackstone.Item && condition.of(blackstone.List)) {
                        
                        blackstone.cycle.call(true, condition.__native, function(sup, pos) {
                            handler.call(this, sup.value, pos.value);
                        }, options);
                        
                    // condition Object
                    // handler.call({ next Function }, value, key) Function
                    } else {
                        
                        var keys = lodash.keys(condition);
                        
                        blackstone.cycle.call(true, keys, function(key, index) {
                            handler.call(this, condition[key], key);
                        }, options);
                    }
                    
                    var keys = lodash.keys(condition);
                    
                } else throw new Error('!condition');
            }
        };
        
        // (handler.call({ next(arguments...) Function }, arguments...) Function, args Array)
        blackstone.travel = function(handler) {
            if (this == true) var args = arguments[1];
            else var args = [].slice.call(arguments, 1, arguments.length);
            handler.apply({ next: function() { blackstone.travel.call(true, handler, arguments); } }, args);
        };
        
        // Tools // end
        
        // lists
        blackstone.lists = (function() {
            
            var lists = {};
            
            // Private method.
            // Unlinking with a list of positions
            // Attention! The position should be complete!
            // .call(list, position Position)
            var __listRemove = function(position) {
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
            
            // new () // => { id Number, length Number, first Position, last Position, value }
            lists.List = (function() {
                
                var id = 0;
                
                var List = function() {
                    this.id = id++;
                    
                    this.length = 0;
                    
                    this.first = undefined;
                    this.last = undefined;
                    
                    this.value = undefined;
                };
                
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
                                    __positionAddAfter.call(this.last, pos);
                                    this.last = pos;
                                } else {
                                    this.first = this.last = pos;
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
                                    __positionAddBefore.call(this.first, pos);
                                    this.first = pos;
                                } else {
                                    this.first = this.last = pos;
                                }
                                
                                this.length++;
                                pos.exists = true;
                            }
                        }
                    }
                    
                    return this.length;
                };
                
                // (handler.call({ ~ next Function }, super Superposition, position Position) Function<, options { sync Boolean, reverse Boolean, callback() Function }>)
                List.prototype.each = function(handler, options) {
                    blackstone.cycle(this, handler, options);
                };
                
                // (comparator.call({ next(Boolean) Function }, source Superposition, target Superposition) Function<, callback Function<, handler Function>>)
                List.prototype.sort = function(comparator, callback, handler) {
                    var list = this;
                    
                    var handle = handler? function() { handler.apply(handler, arguments); } : function() {}
                    var callback = callback? callback : function() {}
                    
                    if (list.first) {
                        
                        if (list.first.next) {
                            
                            blackstone.travel(function(pos) {
                                var travel = this;
                                
                                var next = pos.next;
                                
                                pos.__sort(comparator, function(moved) {
                                    handle(pos, moved);
                                    
                                    if (next) travel.next(next);
                                    else callback();
                                });
                                
                            }, list.first.next);
                            
                        } else callback();
                        
                    } else callback();
                };
                
                // (comparator ~ Function, superposition Superposition, callback(superposition Superposition, position Position, moved Boolean) Function)
                List.prototype.add = function(comparator, superposition, callback) {
                    var list = this;
                    
                    if (superposition.in(list).exists) {
                        superposition.in(list).remove();
                    }
                    
                    list.append(superposition);
                    
                    superposition.in(list).__sort(comparator, function(moved) {
                        callback(superposition, superposition.in(list), moved);
                    });
                };
                
                return List;
                
            })();
            
            // Private methods // start
            
            // Linking with a position // start
            
            // .call(position Position, position Position)
            var __positionAddBefore = function(pos) {
                if (this.prev) {
                    this.prev.next = pos;
                    pos.prev = this.prev;
                }
                this.prev = pos;
                pos.next = this;
            };
            
            // .call(position Position, position Position)
            var __positionAddAfter = function(pos) {
                if (this.next) {
                    this.next.prev = pos;
                    pos.next = this.next;
                }
                this.next = pos;
                pos.prev = this;
            };
            
            // Linking with a position // end
            
            // Unlinking with the positions
            // .call(position Position)
            var __positionRemove = function() {
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
            
            // Private methods // end
            
            lists.Position = (function() {
                
                // new (list List, superposition Superposition)
                var Position = function(list, superposition) {
                    this.exists = false;
                    
                    this.next = undefined;
                    this.prev = undefined;
                    
                    this.list = list;
                    
                    this.super = superposition;
                    
                    this.value = undefined;
                };
                
                // Unsafe // start
                
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
                    
                    if (target.list.first == target) {
                        edge = true;
                        result();
                    } else {
                        blackstone.travel(function(source){
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
                        }, target.prev);
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
                        __listRemove.call(this.list, this);
                        __positionRemove.call(this);
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
                            
                            __positionAddAfter.call(this, pos);
                            
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
                            
                            __positionAddBefore.call(this, pos);
                            
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
                
                var Superposition = function() {
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
        
        // events
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
                
                var defaults = {
                    sync: false,
                    this: false
                };
                
                // new ()
                var Superhandler = function() {
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
                
                // (method Function<, options Object>);
                Superhandler.prototype.bind = function(method, options) {
                    
                    if (!lodash.isObject(options)) var options = {};
                    
                    var options = lodash.defaults(options, defaults);
                    
                    this.method = method;
                    this.options = options;
                    
                };
                
                // Only if bound!
                // (args Array<, callback() Function>);
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
                
                // (args Array<, callback Function>)
                Handlers.prototype.trigger = function(args, callback) {
                    
                    this.list.each(function(superposition, position) {
                        superposition.value.trigger(args, this.next);
                    }, { callback: function() {
                        if (callback) callback();
                    } });
                    
                };
                
                // (handler Function<, options Object>) ~ adapter
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
                
                // (name String, args Array<, callback Function>)
                Emitter.prototype.trigger = function(name, args, callback) {
                    
                    this.__event(name).trigger(args, callback);
                    
                };
                
                // (name String, handler Function<, options Object>) ~ adapter
                // (name String, handler Superhandler)
                // => superhandler
                Emitter.prototype.bind = function(name, handler, options) {
                    
                    return this.__event(name).bind(handler, options);
                    
                };
                
                return Emitter;
                
            })(events.Handlers);
            
            return events;
            
        })(blackstone.lists);
        
        // typing
        blackstone.typing = (function(events, lists) {
            
            var typing = {};
            
            typing.Exports = (function() {
                
                var Exports = function() {};
                
                return Exports;
                
            })();
            
            typing.Item = (function() {
                
                // X // type.new
                var Item = function() {};
                
                // (types... Type)
                // => Boolean
                Item.prototype.of = function() {
                    
                    var prototypes = this.__type.__prototypes();
                    
                    for (var a in arguments) {
                        var found = false;
                        
                        if (this.__type == arguments[a]) { // this type
                            found = true;
                            
                        } else { // this type types
                            for (var p in prototypes.all) {
                                if (prototypes.all[p] instanceof typing.Type) {
                                    if (prototypes.all[p] == arguments[a]) {
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
                
                // Pseudo typing logic.
                // Attension! Construction without arguments!
                // (type Type)
                // => item Item
                Item.prototype.as = function(type) {
                    var item = this;
                    
                    if (!item.__as[type.id]) {
                        type.as(item, function(exports) {
                            item.__as[type.id] = exports;
                        });
                    }
                    
                    return item.__as[type.id];
                    
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
                
                // (handler(prototype) Function<, blackstone.cycle ~ options>)
                Prototypes.prototype.each = function(handler, options) {
                    
                    this.list.each(function(superposition, position) {
                        handler.call(this, superposition.value);
                    }, options);
                    
                };
                
                return Prototypes;
                
            })(typing);
            
            typing.Type = (function(Item, Prototypes, Exports) {
                
                var id = 0;
                
                // X // Type.inherit
                var Type = function() {
                    this.id = id++;
                    
                    this.prototype = {};
                    
                    // .call(item Item, attr, item Item, prototype Object, typePrototype Object, typesPrototype Object, type Type, prototypes { all: [Type], types: { id: Type } })
                    this.constructor = undefined;
                    
                    // .call(item Item, attr, item Item, prototype Object, typePrototype Object, typesPrototype Object, type Type, prototypes { all: [Type], types: { id: Type } })
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
                
                // (type)
                // => { prototypes Array, prototype Array }
                var __prototyping = function(__prototype, __prototypes, type) {
                    
                    var prototypes = type.__prototypes();
                    
                    lodash.extend(__prototype, type.prototype);
                    
                    __prototype.__type = type;
                
                    __prototype.__as = {};
                    
                    for (var p in prototypes.all) {
                        if (prototypes.all[p] instanceof Type) {
                            lodash.extend(__prototypes, prototypes.all[p].prototype);
                        }
                    }
                    
                    return prototypes;
                    
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
                
                // (attr... Array)
                // .constructor.apply(item Item, attr... Array)
                // .inheritor.call(item Item, attr Object, item Item, prototype Object, typePrototype Object, typesPrototype Object, type Type, prototypes { all: [Type], types: { id: Type } })
                // 'new' (attr Object, item Item, prototype Object, typePrototype Object, typesPrototype Object, type Type, prototypes { all: [Type], types: { id: Type } })
                // => item Item
                Type.prototype.new = function() {
                    var type = this;
                    
                    var attr = arguments;
                    
                    var __prototypes = {};
                    var __prototype = {};
                    
                    // prototypes
                    var prototypes = __prototyping(__prototype, __prototypes, type);
                    
                    lodash.extend(__prototype, new events.Emitter);
                    lodash.extend(__prototype, events.Emitter.prototype);
                    
                    var Prototype = function() {};
                    
                    Prototype.prototype = new Item;
                    
                    lodash.extend(Prototype.prototype, __prototypes);
                    lodash.extend(Prototype.prototype, __prototype);
                    
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
                    
                    // constructor
                    var item = new Prototype;
                    
                    if (lodash.isFunction(type.inheritor)) {
                        type.inheritor.call(item, attr, item, Prototype.prototype, __prototype, __prototypes, type, prototypes);
                    }
                    
                    for (var p in prototypes.all) {
                        if (prototypes.all[p] instanceof Type) {
                            if (lodash.isFunction(prototypes.all[p].inheritor)) {
                                prototypes.all[p].inheritor.call(item, attr, item, Prototype.prototype, __prototype, __prototypes, type, prototypes);
                            }
                        }
                    }
                    
                    if (lodash.isFunction(this.constructor)) this.constructor.apply(item, attr);
                    
                    // events
                    async.nextTick(function() {
                        type.trigger('new', [attr, item, Prototype.prototype, prototypes.prototype, prototypes.prototypes, type, prototypes.__prototypes]);
                    });
                    
                    return item;
                };
                
                // (item Item, precallback(exports) Function)
                // .constructor.apply(item Item, attr... Array)
                // .inheritor.call(item Item, attr Object, item Item, prototype Object, typePrototype Object, typesPrototype Object, type Type, prototypes { all: [Type], types: { id: Type } })
                // 'as' (attr Object, item Item, prototype Object, typePrototype Object, typesPrototype Object, type Type, prototypes { all: [Type], types: { id: Type } })
                // => exports Item with wrapped functions
                Type.prototype.as = function(item, precallback) {
                    var type = this;
                    
                    var __prototypes = {};
                    var __prototype = {};
                    
                    // prototypes
                    var prototypes = __prototyping(__prototype, __prototypes, type);
                    
                    var Prototype = function() {};
                    
                    Prototype.prototype = new Exports;
                    
                    lodash.extend(Prototype.prototype, __prototypes);
                    lodash.extend(Prototype.prototype, __prototype);
                    
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
                    
                    // constructor
                    var exports = new Prototype;
                    
                    if (precallback) precallback(exports);
                    
                    var attr = [];
                    
                    for (var p in Prototype.prototype) {
                        if (lodash.isFunction(Prototype.prototype[p])) {
                            Prototype.prototype[p] = (function(method) {
                                return function() { return method.apply(item, arguments); };
                            })(Prototype.prototype[p]);
                        }
                    }
                    
                    if (lodash.isFunction(type.inheritor)) {
                        type.inheritor.call(item, attr, item, Prototype.prototype, __prototype, __prototypes, type, prototypes);
                    }
                    
                    for (var p in prototypes.all) {
                        if (prototypes.all[p] instanceof Type) {
                            if (lodash.isFunction(prototypes.all[p].inheritor)) {
                                prototypes.all[p].inheritor.call(item, attr, item, Prototype.prototype, __prototype, __prototypes, type, prototypes);
                            }
                        }
                    }
                    
                    // events
                    async.nextTick(function() {
                        type.trigger('as', [attr, item, Prototype.prototype, prototypes.prototype, prototypes.prototypes, type, prototypes.__prototypes]);
                    });
                    
                    return exports;
                    
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
                
            })(typing.Item, typing.Prototypes, typing.Exports);
            
            return typing;
            
        })(blackstone.events, blackstone.lists);
        
        // Types // start
        
        // Fast alias...
        blackstone.Type = blackstone.typing.Type;
        blackstone.Item = blackstone.typing.Item;
        
        // 'remove' ()
        // 'add' ()
        blackstone.Position = (function(Type, Item) {
            
            var Position = Type.inherit();
            
            // Not for custom using without Superposition.in.
            // (native typing.Position)
            Position.inheritor = function(attr) {
                var native = attr[0];
                
                this.__native = native;
                this.__native.value = this;
            };
            
            // (<callback(position Position) Function>)
            // position 'remove' ()
            // superposition 'remove' (position Position)
            // list 'remove' (positions... Position)
            // callback.call(position Position)
            Position.prototype.remove = function(callback) {
                var position = this;
                
                if (!position.exists()) {
                    return callback? callback.call(position) : undefined
                }
                
                position.__native.remove();
                
                var series = [];
                
                series.push(function(next) { position.trigger('remove', [], next); });
                series.push(function(next) { position.super().trigger('remove', [position], next); });
                series.push(function(next) { position.list().trigger('remove', [position.super()], next); });
                
                async.series(series, function() {
                    if (callback) callback.call(position);
                });
            };
            
            // (superpositions[Superposition] Array<, <callback.call(position Position, superpositions[Superposition] Array) Function>)
            // ~ 'remove'
            // positions... 'add' ()
            // superpositions... 'add' ()
            // list 'add' (superpositions... Superposition)
            // callback.call(position Position, superpositions[Superposition] Array)
            Position.prototype.append = function(superpositions, callback) { 
                var position = this;
                var list = position.list();
                
                if (!position.exists()) throw new Error('position not exists');
                
                var native = [];
                var series = [];
                
                series.push(function(next) {
                    lodash.each(superpositions, function(superposition) {
                        native.push(superposition.__native);
                        
                        if (superposition.__native == position.super().__native) throw new Error('closed circuit is not supported');
                    });
                    next();
                });
                
                series.push(function(next) {
                    list.remove(superpositions, function() { next(); });
                });
                
                series.push(function(next) {
                    position.__native.append.apply(position.__native, native);
                    next();
                });
                
                series.push(function(next) {
                    async.eachSeries(superpositions, function(superposition, next) {
                        superposition.in(list).trigger('add', [], function() {
                            superposition.trigger('add', [superposition.in(list)], function() {
                                next();
                            });
                        });
                    }, next);
                });
                
                series.push(function(next) { list.trigger('add', superpositions, function() { next(); }); });
                
                async.series(series, function() {
                    if (callback) callback.call(position, superpositions);
                });
            };
            
            // (superpositions[Superposition] Array<, <callback.call(position Position, superpositions[Superposition] Array) Function>)
            // ~ 'remove'
            // positions... 'add' ()
            // superpositions... 'add' ()
            // list 'add' (superpositions... Superposition)
            // callback.call(position Position, superpositions[Superposition] Array)
            Position.prototype.prepend = function(superpositions, callback) { 
                var position = this;
                var list = position.list();
                
                if (!position.exists()) throw new Error('position not exists');
                
                var native = [];
                var series = [];
                
                series.push(function(next) {
                    lodash.each(superpositions, function(superposition) {
                        native.push(superposition.__native);
                        
                        if (superposition.__native == position.super().__native) throw new Error('closed circuit is not supported');
                    });
                    next();
                });
                
                series.push(function(next) {
                    list.remove(superpositions, function() { next(); });
                });
                
                series.push(function(next) {
                    position.__native.prepend.apply(position.__native, native);
                    next();
                });
                
                series.push(function(next) {
                    async.eachSeries(superpositions, function(superposition, next) {
                        superposition.in(list).trigger('add', [], function() {
                            superposition.trigger('add', [superposition.in(list)], function() {
                                next();
                            });
                        });
                    }, next);
                });
                
                series.push(function(next) { list.trigger('add', superpositions, function() { next(); }); });
                
                async.series(series, function() {
                    if (callback) callback.call(position, superpositions);
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
            
        })(blackstone.typing.Type, blackstone.typing.Item);
        
        // 'remove' (position Position)
        // 'add' (position Position)
        blackstone.Superposition = (function(Type, Item, lists) {
            
            var Superposition = Type.inherit();
            
            // ()
            Superposition.inheritor = function() {
                this.__native = new lists.Superposition;
                this.__native.value = this;
            };
                
            // (list List)
            // => position Position
            Superposition.prototype.in = function(list) {
                
                if (!list.__native) return undefined;
                
                var nativePosition = this.__native.in(list.__native);
                
                // Mutual position binding
                if (!nativePosition.value) nativePosition.value = blackstone.Position.new(nativePosition);
                
                return nativePosition.value;
            };
            
            return Superposition;
            
        })(blackstone.typing.Type, blackstone.typing.Item, blackstone.lists);
        
        // 'remove' (superpositions... Superposition)
        // 'add' (superpositions... Superposition)
        blackstone.List = (function(lists, Type, Item) {
            
            var List = Type.inherit();
        
            // (list List)
            var wrapComporator = function(list) {
                return function(source, target) {
                    list.comparator.call(this, source.value, target.value);
                };
            };
            
            // ()
            List.inheritor = function() {
                this.__native = new lists.List;
                this.__native.value = this;
                
                this.comparator = undefined;
            };
            
            // (superpositions[Superposition] Array<, callback.call(list List, superpositions[Superposition] Array) Function>)
            // positions... 'remove' ()
            // superpositions... 'remove' (position Position)
            // list 'remove' (superpositions... Superposition)
            // callback.call(list List, superpositions[Superposition] Array)
            List.prototype.remove = function(superpositions, callback) {
                var list = this;
                
                var series = [];
                var removed = [];
                
                series.push(function(next) {
                    async.eachSeries(superpositions, function(superposition, next) {
                        
                        var series = [];
                        
                        if (superposition.in(list).exists()) {
                            superposition.in(list).__native.remove();
                            
                            removed.push(superposition);
                            
                            series.push(function(next) { superposition.in(list).trigger('remove', [], next); });
                            series.push(function(next) { superposition.trigger('remove', [superposition.in(list)], next); });
                        }
                        
                        async.series(series, function() {
                            next();
                        });
                        
                    }, next);
                });
                
                series.push(function(next) {
                    if (removed.length > 0) {
                        list.trigger('remove', removed, function() {
                            next();
                        });
                    } else next();
                });
                
                async.series(series, function() {
                    if (callback) callback.call(list, removed);
                });
            };
            
            // (superpositions[Superposition] Array<, callback.call(list List, superpositions[Superposition] Array) Function>)
            // ~ 'remove'
            // positions... 'add' ()
            // superpositions... 'add' (position Position)
            // list 'add' (superpositions... Superposition)
            // callback.call(list List, superpositions[Superposition] Array)
            List.prototype.append = function(superpositions, callback) {
                var list = this;
                
                var native = [];
                var series = [];
                
                series.push(function(next) {
                    lodash.each(superpositions, function(superposition) {
                        native.push(superposition.__native);
                    });
                    next();
                });
                
                series.push(function(next) {
                    list.remove(superpositions, function() { next(); });
                });
                
                series.push(function(next) {
                    list.__native.append.apply(list.__native, native);
                    next();
                });
                
                series.push(function(next) {
                    async.eachSeries(superpositions, function(superposition, next) {
                        superposition.in(list).trigger('add', [], function() {
                            superposition.trigger('add', [superposition.in(list)], function() {
                                next();
                            });
                        });
                    }, next);
                });
                
                series.push(function(next) { list.trigger('add', superpositions, function() { next(); }); });
                
                async.series(series, function() {
                    if (callback) callback.call(list, superpositions);
                });
            };
            
            // (superpositions[Superposition] Array<, callback.call(list List, superpositions[Superposition] Array) Function>)
            // ~ 'remove'
            // positions... 'add' ()
            // superpositions... 'add' (position Position)
            // list 'add' (superpositions... Superposition)
            // callback.call(list List, superpositions[Superposition] Array)
            List.prototype.prepend = function(superpositions, callback) {
                var list = this;
                
                var native = [];
                var series = [];
                
                series.push(function(next) {
                    lodash.each(superpositions, function(superposition) {
                        native.push(superposition.__native);
                    });
                    next();
                });
                
                series.push(function(next) {
                    list.remove(superpositions, function() { next(); });
                });
                
                series.push(function(next) {
                    list.__native.prepend.apply(list.__native, native);
                    next();
                });
                
                series.push(function(next) {
                    async.eachSeries(superpositions, function(superposition, next) {
                        superposition.in(list).trigger('add', [], function() {
                            superposition.trigger('add', [superposition.in(list)], function() {
                                next();
                            });
                        });
                    }, next);
                });
                
                series.push(function(next) { list.trigger('add', superpositions, function() { next(); }); });
                
                async.series(series, function() {
                    if (callback) callback.call(list, superpositions);
                });
            };
            
            // (comparator.call({ next(Boolean) Function }, source Superposition, target Superposition) Function, callback Function)
            // list 'sort' ()
            List.prototype.sort = function(callback) {
                var list = this;
                
                if (!list.comparator) throw new Error('Wrong comparator');
                
                var comparator = wrapComporator(list);
                
                list.__native.sort(comparator, function() {
                    list.trigger('sort', [], function() {
                        if (callback) callback();
                    });
                });
            };
            
            // (superpositions[Superposition] Array<, callback.call(list List, superpositions[Superposition] Array) Function>)
            // positions... 'add' ()
            // superpositions... 'add' (position Position)
            // list 'add' (superpositions... Superposition)
            // callback.apply(list, superpositions... Superposition)
            List.prototype.add = function(superpositions, callback) {
                var list = this;
                
                if (!list.comparator) throw new Error('Wrong comparator');
                
                var comparator = wrapComporator(list);
                
                var series = [];
                
                series.push(function(next) {
                    list.remove(superpositions, function() { next(); });
                });
                
                series.push(function(next) {
                    async.eachSeries(superpositions, function(superposition, next) {
                        list.__native.add(comparator, superposition.__native, function() {
                            superposition.in(list).trigger('add', [], function() {
                                superposition.trigger('add', [superposition.in(list)], function() {
                                    next();
                                });
                            });
                        });
                    }, next);
                });
                
                series.push(function(next) {
                    list.trigger('add', superpositions, next);
                });
                
                async.series(series, function() {
                    if (callback) callback.call(list, superpositions);
                });
            };
            
            // (handler.call(~ { native lists.Superposition, super Superposition, position Position }, superposition Superposition, position Position) Function<, options Object>) ~ adapter
            List.prototype.each = function(handler, options) {
                blackstone.cycle(this, handler, options);
            };
            
            // ()
            List.prototype.toArray = function() {
                var array = [];
                this.each(function(superposition) {
                    array.push(superposition);
                }, { sync: true });
                return array;
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
            
        })(blackstone.lists, blackstone.typing.Type, blackstone.typing.Item);
        
        blackstone.Data = (function(Type) {
            
            var Data = Type.inherit();
            
            Data.defaults = {};
            
            Data.constructor = function(data) {
                this.__data = data;
            };
            
            Data.inheritor = function() {
                this.defaults = {};
            };
            
            // (< options: { defaults: true, clone: true } >)
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
            
            // (< options ~ adapter<, callback Function >>)
            // 'get' (data Object)
            // callback (data Object)
            // => data Object
            Data.prototype.get = function(options, callback) {
                var self = this;
                
                var data = __get(self, self.__data, options);
                
                self.trigger('get', [data], function() {
                    if (callback) callback(data);
                });
                
                return data
            };
            
            // (source Object<, callback(data Object, oldData Object) Function>)
            // 'set' (data Object, oldData Object)
            // 'get' (data Object)
            // callback (data Object, oldData Object)
            // => data Object
            Data.prototype.set = function(source, callback) {
                var self = this;
                
                var old = __get(self, self.__data, { defaults: false, clone: true });
                
                self.__data = lodash.cloneDeep(source);
                var data = __get(self, self.__data);
                
                self.trigger('set', [data, old], function() {
                    self.trigger('get', [data], function() {
                        if (callback) callback(data, old);
                    });
                });
                
                return data;
            };
            
            // (<callback(data Object, oldData Object) Function>)
            // 'unset' (data Object, oldData Object)
            // 'set' (data Object, oldData Object)
            // 'get' (data Object)
            // callback (data Object, oldData Object)
            // => data Object
            Data.prototype.unset = function(callback) {
                var self = this;
                
                var old = __get(self, self.__data, { defaults: false, clone: true });
                self.__data = {};
                var data = __get(self, self.__data);
                
                self.trigger('unset', [data, old], function() {
                    self.trigger('set', [data, old], function() {
                        self.trigger('get', [data], function() {
                            if (callback) callback(data, old);
                        });
                    });
                });
                
                return data;
            };
            
            return Data;
            
        })(blackstone.typing.Type);
        
        // Types // end
        
        return blackstone;
    };
    
    // .version String
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