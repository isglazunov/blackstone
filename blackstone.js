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
        
        // Prototypes
        
        var prototypesIndex = 0;
        var instancesIndex = 0;
        
        // Prototype
        var Prototype = blackstone.Prototype = function(options){
            this.index = prototypesIndex++;
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
            var eachPrototype = function(prot){
                lodash.each(prot.prototypes, function(ins){
                    if (ins instanceof Instance && ins.prototype && ins.prototype.prototype) {
                        lodash.merge(pre.prototype, ins.prototype.prototype);
                        eachPrototype(ins.prototype);
                    }
                });
            };
            
            eachPrototype(prototype);
            
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
            
            instance.index = instancesIndex++;
            
            return instance;
        };
        
        Prototype.prototype.instanceof = function(){
            for (var a in arguments) {
                if (!_instanceof(this, arguments[a].index)) return false;
            }
            return true;
        };
        
        // Instance
        var Instance = blackstone.Instance = function(){};
        
        Instance.prototype.instanceof = function(){
            for (var a in arguments) {
                if (arguments[a] instanceof Prototype) {
                    if (!_instanceof(this.prototype, arguments[a].index)) return false;
                }
            }
            return true;
        };
        
        Instance.prototype.extend = function(options){
            var prototype = new Prototype(options);
            prototype.prototypes.push(this);
            return prototype
        };
        
        // Events
        var eventsIndex = 0;
        
        // Events
        var Events = blackstone.Events = new blackstone.Prototype({
            prototype: function(){
                this._sync = false;
                this._self = false;
                this._limit = null;
                this._events = {};
            }
        });
        
        var off = function(self, name, handler){
            if (!handler.prev) { // first
                if (!handler.next) { // last
                    delete self.prototype._events[name];
                } else { // not last
                    self.prototype._events[name] = handler.next;
                    handler.next.prev = undefined;
                    handler.next.last = handler.last;
                    handler.next = undefined;
                }
            } else { // not first
                if (!handler.next) { // last
                    self.prototype._events[name].last = handler.prev;
                    handler.prev.next = undefined;
                    handler.prev = undefined;
                } else { // not last
                    handler.prev.next = handler.next;
                    handler.next.prev = handler.prev;
                }
            }
        };
        
        Events.prototype.on = function(name, callback, options){
            var options = lodash.isObject(options)? options : {}
            lodash.defaults(options, {
                context: this,
                sync: this.prototype._sync,
                self: this.prototype._self,
                limit: this.prototype._limit
            });
            var event = {
                index: eventsIndex++,
                callback: callback,
                context: options.context,
                sync: options.sync,
                self: options.self,
                limit: options.limit,
                prev: undefined,
                next: undefined
            };
            if(!lodash.isObject(this.prototype._events)) this.prototype._events = {};
            if(this.prototype._events[name]) { // If list 
                event.prev = this.prototype._events[name].last;
                this.prototype._events[name].last.next = event;
                this.prototype._events[name].last = event;
            } else {;
                event.last = event;
                this.prototype._events[name] = event;
            } 
            return this;
        };
        
        Events.prototype.once = function(name, callback, options){
            return this.on(name, callback, (options? lodash.merge(options, {limit: 1}) : {limit: 1}) );
        };
        
        Events.prototype.off = function(query, callback){
            var self = this;
            
            var options = {
                name: lodash.isString(query.name)? query.name : undefined,
                context: !lodash.isUndefined(query.context)? query.context : undefined,
                callback: lodash.isFunction(query.callback)? query.callback : undefined,
                sync: lodash.isBoolean(query.sync)? query.sync : undefined,
                self: lodash.isBoolean(query.self)? custom.self : undefined,
                limit: lodash.isNull(query.limit) || lodash.isNumber(query.limit)? query.limit : undefined,
            };
            
            var offHandler = function(name, handler){
                if(!lodash.isUndefined(options.callback) && handler.callback !== options.callback) return;
                if(!lodash.isUndefined(options.context) && handler.context !== options.context) return;
                if(!lodash.isUndefined(options.sync) && handler.sync !== options.sync) return;
                if(!lodash.isUndefined(options.self) && handler.self !== options.sync) return;
                if(!lodash.isUndefined(options.limit) && handler.limit !== options.limit) return;
                
                off(self, name, handler);
            };
            var offEvent = function(name){
                if(self.prototype._events[name]) {
                    offHandler(name, self.prototype._events[name]);
                }
            };
            var offEvents = function(){
                for(var name in self.prototype._events) {
                    offEvent(name);
                }
            };
            
            if(!lodash.isObject(this.prototype._events)) this.prototype._events = {};
            if(lodash.isUndefined(options.name)) {
                if(lodash.isUndefined(options.context) && lodash.isUndefined(options.callback) && lodash.isUndefined(options.sync) && lodash.isUndefined(options.limit)) self.prototype._events = {};
                else offEvent(options.name);
            } else {
                if(self.prototype._events[options.name] && lodash.isUndefined(options.context) && lodash.isUndefined(options.callback) && lodash.isUndefined(options.sync) && lodash.isUndefined(options.limit)) delete self.prototype._events[options.name];
                else offEvents();
            }
        };
        
        Events.prototype.trigger = function(name){
                var self = this;
                var args = lodash.isArray(arguments[1]) || lodash.isArguments(arguments[1])? arguments[1] : [];
                var callback = lodash.isFunction(arguments[1])? arguments[1] : lodash.isFunction(arguments[2])? arguments[2] : function(){};
                
                var core = function(handler){
                    async.nextTick(function(){
                        var next = coreNext(handler);
                        if(lodash.isNumber(handler.limit)) {
                            if(handler.limit > 0) handler.limit--;
                            else return next();
                        }
                        
                        var _args = [];
                        if(handler.self) _args.push([{
                            index: handler.index,
                            limit: function(limit){
                                if(lodash.isNumber(limit) || lodash.isNull(limit)) handler.limit = limit;
                                return handler.limit;
                            },
                            off: function(){
                                off(self, name, handler);
                            },
                        }]);
                        
                        if(!handler.sync) _args.push([next]);
                        _args.push(args);
                        
                        handler.callback.apply(handler.context, [].concat.apply([], _args));
                        if(handler.sync) next();
                    });
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
                
                if(!lodash.isObject(this.prototype._events)) this.prototype._events = {};
                if(self.prototype._events[name]) {
                    if (name !== '*') {
                        self.trigger('*', [name, args], function(){
                            core(self.prototype._events[name]);
                        })
                    } else core(self.prototype._events[name]);
                } else {
                    if(callback) callback();
                }
            };
        
        var types = blackstone.types = {};
        
        var Server = types.Server = Events.new().extend({
            constructor: function(){
                this._events = Events.new();
            }
        });
        
        Server.prototype.describe = function(name, description, options){
            var server = this;
            server.trigger("describe", [name, description], function(){
                server.trigger(name+":describe", [name, description], function(){
                    server._events.on(name, function(self, next, client, exports){
                        description.apply(client, arguments);
                    }, options);
                    server.trigger("described", [name, description], function(){
                        server.trigger(name+":described", [name, description]);
                    });
                });
            });
        };
    
        Server.prototype.initialize = function(types, client, exports, callback){
            var server = this;
            server.trigger("initialize", [types, client, exports], function(){
                async.mapSeries(types, function(type, next) {
                    if(!lodash.isObject(exports[type])) exports[type] = {};
                    server.trigger(type+":initialize", [type, client, exports[type]], function(){
                        server._events.trigger(type, [client, exports[type]], function(){
                            server.trigger(type+":initialized", [type, client, exports[type]], function(){
                                next();
                            });
                        });
                    });
                }, function(){
                    server.trigger("initialized", [types, client, exports], function(){
                        if(lodash.isFunction(callback)) callback(types, client, exports);
                    });
                });
            });
        };
        
        Server.prototype.use = function(name, client, exports){
            return exports;
        };
        
        blackstone.types.server = Server.new();
        
        var Client = types.Client = Events.new().extend({
            constructor: function(){
                this._server = blackstone.types.server;
                this._types = [];
                this._exports = {};
            }
        });
        
        Client.prototype.initialize = function(callback){
            if(!lodash.isObject(this._exports)) this._exports = {};
            return this._server.initialize(this._types, this, this._exports, function(types, client, exports){
                callback(client);
            });
        };
        
        Client.prototype.as = function(name){
            if(!lodash.isObject(this._exports)) this._exports = {};
            return this._server.use(name, this, this._exports[name]);
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