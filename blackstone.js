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
        
        // Событийная система
        var Events = blackstone.Events = function(){
            
            // Опции устанавливаемые для каждого экземпляра событийной системы
            this.__eventsSync = false; // Синхронный или асинхронный обработчик
            this.__eventsSelf = false; // Добавлять или не добавлять аргумент управления обработчиком из обработчика
            this.__eventsAll = '*'; // Имя общего обработчика
            this.__eventsLimit = null; // Лимит вызовов обработчика по умолчанию
            this.__events = {}; // Поименный хеш всех событий, ссылки на первый из обработчиков
        };
        
        // Уникальный index каждого обработчика
        Events.__index = 0;
        
        // Снятие прослушивания конкретного обработчика
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
        
        Events.prototype.bind = function(name, callback, options){
            var options = lodash.isObject(options)? options : {}
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
        
        Events.prototype.unbind = function(query, callback){
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
                if(handler.self) _args.push([{
                    index: handler.index,
                    limit: function(limit){
                        if(lodash.isNumber(limit) || lodash.isNull(limit)) handler.limit = limit;
                        return handler.limit;
                    },
                    off: function(){
                        Events.unbind(self, name, handler);
                    },
                }]);
                
                if(!handler.sync) _args.push([next]);
                _args.push(args);
                
                handler.callback.apply(handler.context, [].concat.apply([], _args));
                if(handler.sync) next();
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
                    })
                } else core(self.__events[name]);
            } else {
                if(callback) callback();
            }
        };
        
        // Новая типизация
        // Внимание! Перекрывать __index не корректно
        
        // Основная функция-конструктор
        // Создает объект с функционалом типа
        // Type instance нужен для организации поведения и создания item
        var Type = blackstone.Type = function(attributes){
            
            // Уникальный index каждого type
            this.__index = Type.__index++;
            
            // Подделка под prototype аттрибут
            // При создании item будет наследоваться
            // Должен быть объектом
            this.prototype = {};
            
            // Ссылка на родителей в наследовании
            // Должен быть массивом с экземплярами Type и Item
            this.types = [];
            
            // Слить переданные данные с this.
            lodash.extend(this, attributes);
        };
        
        // Должен обладать функционалом событий
        Type.prototype = new Events;
        
        // Уникальный index каждого type.
        Type.__index = 0;
        
        // Находит все типы используемые при наследовании по их __index
        // В том числе если в types находится экземпляр
        // Возвращает объект где key == __index
        // Не проверяет является ли __index числом и types массивом
        Type.prototype.__findAllTypes = function(){
            
            var results = {
                byOrder: [], // В порядке добавления
                byIndex: {} // По index(у)
            };
            
            // Обработчик одного типа
            var core = function(type){
                if (!results.byIndex[type.__index]) { // Если ранее тип не обрабатывался
                    
                    // Добавить к обработанным
                    results.byOrder.push(type);
                    results.byIndex[type.__index] = type;
                        
                    // Обработать родителей
                    for (var t in type.types) { // Каждый из родителей
                        
                        if (type.types[t] instanceof Type) { // Если родитель type
                            // Слить результат его внутренних поисков с нашими
                            lodash.extend(results, core(type.types[t]));
                            
                        } else if (type.types[t] instanceof Item) { // Если item
                            if (type.types[t].type instanceof Type) {
                                // Слить результат его внутренних поисков с нашими
                                lodash.extend(results, core(type.types[t].type));
                            }
                        }
                    }
                }
            };
            
            core(this);
            
            // Вернуть на уровень выше получившийся список index: type
            return results;
        };
        
        // Новая функция конструктор вместо native new
        // Создает экземпляр Item из type и включая в него всех его родителей
        Type.prototype.new = function(callback){
            var type = this; // Ссылка на тип
            
            // Предварительный прототип для item, для обертки общих prototype
            var PreItem = function(){};
            PreItem.prototype = new Item;
            
            // Получить все наследуемые типы.
            var types = this.__findAllTypes();
            
            // Слить прототипы
            for(var t in types.byOrder) {
                lodash.merge(PreItem.prototype, types.byOrder[t].prototype);
            }
            
            // Создать экземпляр item
            var item = new PreItem;
            
            item.__index = Item.__index++; // Уникальный index каждого item
            item.type = this; // Ссылка на тип данного item
            
            this.trigger('new', [item, types], function(){
                if (lodash.isFunction(callback)) callback(item, types);
            });
            
            // Вернуть получившийся item
            return item;
        };
        
        // Наследовать от type новый type.
        Type.prototype.inherit = function(/* [attributes[, callback]] */){
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
        
        // Удобный и быстрый способ унаследоваться в новом стиле
        Type.inherit = function(attributes){
            return new Type(attributes);
        };
        
        // Объект - экземпляр наследующий все от экземпляров Type
        // Внимание! Создание экземпляра item не через type не корректно
        var Item = blackstone.Item = function(){};
        
        // Уникальный index каждого item
        Item.__index = 0;
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