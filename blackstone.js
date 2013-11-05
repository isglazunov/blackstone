// blackstone:develop
// https://github.com/isglazunov/blackstone/tree/develop
// Uses the prefix __ to indicate the system variables. Use the system variables with the understanding!

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
        
        // Function .Events()
        // System of events.
        var Events = blackstone.Events = function(){
            
            // Options describing the behavior of an instance of an event of default.
            // These options can be overridden when calling bind.
            this.__eventsSync = false; // events.bind option: sync
            this.__eventsSelf = false; // events.bind option: self
            this.__eventsLimit = null; // events.bind option: limit
            this.__eventsAll = '*'; // The event name is called when any event.
            this.__events = {}; // An object with reference to the first handler for each event.
        };
        
        // A unique index for each event handler created blackstone.
        Events.__index = 0;
        // The system variable. Use with understanding.
        
        // Function .Events.unbind(Object events, String name, Object handler)
        // The withdrawal of the handler chain of handlers.
        Events.unbind = function(self, name, handler){
            if(!handler.prev) { // first
                if(!handler.next) { // last
                    delete self.__events[name];
                } else { // not last
                    self.__events[name] = handler.next;
                    handler.next.prev = undefined;
                    handler.next.last = handler.last;
                    handler.next = undefined;
                }
            } else { // not first
                if(!handler.next) { // last
                    self.__events[name].last = handler.prev;
                    handler.prev.next = undefined;
                    handler.prev = undefined;
                } else { // not last
                    handler.prev.next = handler.next;
                    handler.next.prev = handler.prev;
                }
            }
        };
        
        // Function .Events.Self(Object events, String name, Object handler)
        // The constructor of the object `self`.
        Events.Self = function(events, name, handler){
            
            // Number .index
            this.index = handler.index;
            
            // Function .limit()
            // Returns the current limit call handlers.
            this.limit = function(limit){
                if (lodash.isNumber(limit) || lodash.isNull(limit)) handler.limit = limit;
                return handler.limit;
            }
            
            // Function .unbind()
            // Detach this handler.
            this.unbind = function(){
                Events.unbind(events, name, handler);
            }
        };
        
        // Function .bind(String name, Function callback[, Object options])
        // Set the handler to the handler chain.
        Events.prototype.bind = function(name, callback, options){
            var options = lodash.isObject(options)? options : {}
            
            // Default options
            lodash.defaults(options, {
                context: this,
                sync: this.__eventsSync,
                self: this.__eventsSelf,
                limit: this.__eventsLimit
            });
            var event = {
                index: Events.__index++,
                callback: callback,
                context: options.context,
                sync: options.sync,
                self: options.self,
                limit: options.limit,
                prev: undefined,
                next: undefined
            };
            
            if(!lodash.isObject(this.__events)) this.__events = {};
            if(this.__events[name]) { // If list 
                event.prev = this.__events[name].last;
                this.__events[name].last.next = event;
                this.__events[name].last = event;
            } else {;
                event.last = event;
                this.__events[name] = event;
            } 
            return this;
        };
        
        // Function .unbind([Object query])
        // Removes handlers of the handler chain as per request.
        Events.prototype.unbind = function(query){
            var self = this;
            
            // Default options
            var options = {
                name: lodash.isString(query.name)? query.name : undefined,
                context: !lodash.isUndefined(query.context)? query.context : undefined,
                callback: lodash.isFunction(query.callback)? query.callback : undefined,
                sync: lodash.isBoolean(query.sync)? query.sync : undefined,
                self: lodash.isBoolean(query.self)? custom.self : undefined,
                limit: lodash.isNull(query.limit) || lodash.isNumber(query.limit)? query.limit : undefined
            };
            
            var offHandler = function(name, handler){
                if(!lodash.isUndefined(options.callback) && handler.callback !== options.callback) return;
                if(!lodash.isUndefined(options.context) && handler.context !== options.context) return;
                if(!lodash.isUndefined(options.sync) && handler.sync !== options.sync) return;
                if(!lodash.isUndefined(options.self) && handler.self !== options.sync) return;
                if(!lodash.isUndefined(options.limit) && handler.limit !== options.limit) return;
                
                Events.unbind(self, name, handler);
            };
            var offEvent = function(name){
                if(self.__events[name]) {
                    offHandler(name, self.__events[name]);
                }
            };
            var offEvents = function(){
                for(var name in self.__events) {
                    offEvent(name);
                }
            };
            
            if(!lodash.isObject(this.__events)) this.__events = {};
            if(lodash.isUndefined(options.name)) {
                if(lodash.isUndefined(options.context) && lodash.isUndefined(options.callback) && lodash.isUndefined(options.sync) && lodash.isUndefined(options.limit)) self.__events = {};
                else offEvent(options.name);
            } else {
                if(self.__events[options.name] && lodash.isUndefined(options.context) && lodash.isUndefined(options.callback) && lodash.isUndefined(options.sync) && lodash.isUndefined(options.limit)) delete self.__events[options.name];
                else offEvents();
            }
        };
        
        // Function .trigger(String name[, Array args[, Function callback]]) or .trigger(String name[, Function callback])
        // Trigger all event handlers by name.
        Events.prototype.trigger = function(name){
            var self = this;
            var args = lodash.isArray(arguments[1]) || lodash.isArguments(arguments[1])? arguments[1] : [];
            var callback = lodash.isFunction(arguments[1])? arguments[1] : lodash.isFunction(arguments[2])? arguments[2] : function(){};
            
            var core = function(handler){
                var next = coreNext(handler);
                if(lodash.isNumber(handler.limit)) {
                    if(handler.limit > 0) handler.limit--;
                    else return next();
                }
                
                var _args = [];
                if(handler.self) _args.push([new Events.Self(self, name, handler)]);
                
                if(!handler.sync) _args.push([next]);
                _args.push(args);
                if (!handler.sync) {
                    async.nextTick(function(){
                        handler.callback.apply(handler.context, [].concat.apply([], _args));
                    });
                } else {
                    handler.callback.apply(handler.context, [].concat.apply([], _args));
                    next();
                }
            }
            
            var coreNext = function(handler){
                var called = false;
                if(handler.next) {
                    var next = handler.next;
                    return function() {
                        if(!called) {
                            called = true;
                            core(next);
                        }
                    }
                } else return function(){
                    if(!called && callback) {
                        called = true;
                        callback();
                    }
                }
            };
            
            if(!lodash.isObject(this.__events)) this.__events = {};
            if(self.__events[name]) {
                if(self.__eventsAll != name) {
                    self.trigger(self.__eventsAll, [name, args], function(){
                        core(self.__events[name]);
                    });
                } else core(self.__events[name]);
            } else {
                if(callback) callback();
            }
        };
        
        // Function .Type([Object attributes])
        // Returns the object which received type behavior.
        // The resulting type is used for the assembly item.
        var Type = blackstone.Type = function(attributes){
            
            // A unique index for each type.
            this.__index = Type.__index++;
            
            // Merge with a functional blackstone.Events.
            lodash.extend(this, new Events);
            
            // Merge with attributes.
            lodash.extend(this, attributes);
            
            // Parental types.
            var types = [];
            if (lodash.isObject(attributes) && lodash.isArray(attributes.types)) types.push.apply(types, attributes.types);
            this.types = types;
            
            // Fake attribute prototype.
            var prototype = {};
            if (lodash.isObject(attributes) && lodash.isObject(attributes.prototype)) lodash.merge(prototype, attributes.prototype);
            this.prototype = prototype;
        };
        
        // Inherit methods blackstone.Events.
        lodash.extend(Type.prototype, Events.prototype);
        
        // A unique index for each type created blackstone.
        Type.__index = 0;
        
        // Created to find all types of parenting including the source.
        Type.prototype.__findAllTypes = function(){
            
            var results = {
                byOrder: [],
                byIndex: {}
            };
            
            // One type handler
            var core = function(type){
                if (!results.byIndex[type.__index]) { // If it first handling
                        
                    // Handle parental types
                    for (var t in type.types) {
                        
                        if (type.types[t] instanceof Type) {
                            lodash.extend(results, core(type.types[t]));
                            
                        } else if (type.types[t] instanceof Item) {
                            if (type.types[t].type instanceof Type) {
                                lodash.extend(results, core(type.types[t].type));
                            }
                        }
                    }
                    
                    // Mark as handled
                    results.byOrder.push(type);
                    results.byIndex[type.__index] = type;
                }
            };
            
            core(this);
            
            return results;
        };
        
        // Function .new([[Array args, ]Function callback])
        // Creates an instance of the item from the instance type.
        // Merges all the prototypes of all the parent types.
        Type.prototype.new = function(){
            var type = this; // Ссылка на тип
            
            // Parse arguments
            var args = [];
            var callback = function(){};
            
            if (lodash.isFunction(arguments[0])) {
                var callback = arguments[0];
            } else if (lodash.isArray(arguments[0])) {
                var args = arguments[0];
                if (lodash.isFunction(arguments[1])) callback = arguments[1];
            }
            
            var PreItem = function(){};
            PreItem.prototype = new Item;
            
            // All parental types
            var types = this.__findAllTypes();
            
            // Merge prototypes
            for(var t in types.byOrder) {
                lodash.merge(PreItem.prototype, types.byOrder[t].prototype);
            }
            
            // Item isntance
            var item = new PreItem;
            
            item.__index = Item.__index++; // A unique index
            item.type = this; // Type alias
            item.__behaviors = {}; // Space for behaviors
            
            async.mapSeries(types.byOrder, function(type, next){
                
                // Call constructor of all types.
                if (lodash.isFunction(type.constructor)) type.constructor.apply(item, args);
                else if (!lodash.isArray(type.constructor) && lodash.isObject(type.constructor)) {
                    lodash.merge(item, type.constructor);
                }
                
                next();
                
            }, function(){
                
                async.mapSeries(types.byOrder, function(type, next){
                    
                    // Call the behavior of all types of parenting in the context of the item.
                    type.trigger('behaviors', [item, item.__behaviors], next);
                
                }, function(){
                    
                    async.mapSeries(types.byOrder, function(type, next){
                        
                        // Call the event `new` only this type.
                        type.trigger('new', [args, item, types], next);
                        
                    }, function(){
                        if (lodash.isFunction(callback)) callback(item, types);
                    });
                    
                });
                
            });
            
            return item;
        };
        
        // Function .inherit([[Object args, ]Function callback])
        // Inherit a new type of this type.
        Type.prototype.inherit = function(){
            
            // Parse arguments
            var attributes = {};
            var callback = function(){};
            
            if (lodash.isFunction(arguments[0])) {
                var callback = arguments[0];
            } else if (lodash.isObject(arguments[0]) && !lodash.isArray(arguments[0])) {
                var attributes = arguments[0];
                if (lodash.isFunction(arguments[1])) callback = arguments[1];
            }
            
            var type = new Type(attributes);
            
            type.types.push(this);
            
            this.trigger('inherit', [type], function(){
                callback(type);
            });
            
            return type;
        };
        
        // Function .as(name, behavior[, Object options])
        // Describes the behavior within the type.
        Type.prototype.as = function(name, behavior, options){
            var options = lodash.isObject(options)? options : {}
            lodash.defaults(options, {
                sync: this.__eventsSync,
                self: this.__eventsSelf,
                limit: this.__eventsLimit
            });
            
            var type = this;
            type.trigger('as', [name, behavior], function(){
                type.bind('behaviors', function(){
                    
                    var args = lodash.toArray(arguments);
                    var last = args.splice(args.length - 1, 1)[0];
                    
                    if (!lodash.isObject(last[name])) last[name] = {};
                    
                    args.push(last[name]);
                    
                    // item, type
                    if (options.sync && !options.self) var item = args[0];
                    
                    // self, item, type // next, item, type
                    else if ( (options.sync && options.self) || (!options.sync && !options.self) ) var item = args[1];
                    
                    // self, nexxt, item, type
                    else var item = args[2];
                    
                    behavior.apply(item, args);
                }, options);
            });
            
            return this;
        };
        
        // Function .inherit([[Object args, ]Function callback])
        // Inherit a new type of this type.
        Type.inherit = function(attributes){
            return new Type(attributes);
        };
        
        // Function .Item()
        // Not intended for custom build!
        // Available for the possibility to check the inheritance.
        var Item = blackstone.Item = function(){
            
            // Merge with a functional blackstone.Events.
            lodash.extend(this, new Events);
        };
        
        // Inherit methods blackstone.Events.
        lodash.extend(Item.prototype, Events.prototype);
        
        // A unique index for each item created blackstone.
        Item.__index = 0;
        
        // Function .as(String behavior)
        // Easy way get behavior.
        Item.prototype.as = function(behavior){
            if (this.__behaviors[behavior]) return this.__behaviors[behavior];
            else return undefined;
        };
        
        // Object .Document instanceof Type
        // Type with special abilities inherent in the documents.
        var Document = blackstone.Document = Type.inherit({
            constructor: { __document: {} }
        });
        
        // Function .get([Function callback])
        // Always returns the document.
        // If passed argument callback, it will be launched after the events get.
        Document.prototype.get = function(callback){
            var self = this;
            
            self.trigger('get', [lodash.cloneDeep(self.__document)], function(){
                if(lodash.isFunction(callback)) callback(lodash.cloneDeep(self.__document));
            });
            
            return self.__document;
        };
        
        // Слить данные с документом
        Document.prototype.set = function(data, callback){
            var self = this;
            
            // Строгая типизация
            if(!lodash.isObject(data) && lodash.isArray(data) && lodash.isFunction(data)) throw new TypeError('wrong data argument');
            var prev = lodash.cloneDeep(self.__document); // Предыдущее состояние
            lodash.merge(self.__document, data); // Слить данные с документом
            
            self.trigger('set', [lodash.cloneDeep(self.__document), prev, lodash.cloneDeep(data)], function(){
                if(lodash.isFunction(callback)) callback(lodash.cloneDeep(self.__document), prev, lodash.cloneDeep(data));
            });
            
            return self;
        };
        
        // document.reset(Object data[, Function callback]);
        // document.reset({}, function(){ /* after events */ }).get().attr
        Document.prototype.reset = function(data, callback){
            var self = this;
            
            // Strict typing argument Object data
            if(!lodash.isObject(data) && lodash.isArray(data) && lodash.isFunction(data)) throw new TypeError('wrong Object data argument');
            
            var prev = lodash.cloneDeep(self.__document);
            self.__document = data;
            var exports = {};
            
            self.trigger('reset', [lodash.cloneDeep(self.__document), prev, lodash.cloneDeep(data)], function(){
                self.trigger('set', [lodash.cloneDeep(self.__document), prev, lodash.cloneDeep(data)], function(){
                    if(lodash.isFunction(callback)) callback(lodash.cloneDeep(self.__document), prev, lodash.cloneDeep(data));
                });
            });
            
            return self;
        };
    
        // document.unset([Function callback]);
        // document.unset(function(){ /* after events */ }).get() // {}
        Document.prototype.unset = function(callback){
            var self = this;
            var prev = lodash.clone(self.__document);
            var data = {};
            self.__document = data;
            var exports = {};
            
            self.trigger('unset', [lodash.cloneDeep(self.__document), prev], function(){
                self.trigger('reset', [lodash.cloneDeep(self.__document), prev, lodash.cloneDeep(data)], function(){
                    self.trigger('set', [lodash.cloneDeep(self.__document), prev, lodash.cloneDeep(data)], function(){
                        if(lodash.isFunction(callback)) callback(lodash.cloneDeep(self.__document), prev, lodash.cloneDeep(data));
                    });
                });
            });
            
            return self;
        };
        
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