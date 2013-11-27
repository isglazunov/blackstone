// Blackstone / blackstone
// https://github.com/isglazunov/blackstone
// isglazunov / Ivan Sergeevich Glazunov / isglazunov@gmail.com

// Blackstone
(function() {
    
    // Локальный указатель версии модуля Blackstone
    var version = '0.1.0.3';
    
    // Конструктор Blackstone
    // new Blackstone(§lodash!) Function
    var Blackstone = function(lodash) {
        var blackstone = this;
        
        // Публичный указатель версии модуля
        // Условно доступен только для чтения.
        blackstone._version = version;
        
        // Основной инструментарий
        (function(blackstone, lodash) {
            
            // Итератор
            // Предоставляет универсальный интерфейс циклов.
            (function(blackstone, lodash) {
                
                // Может быть синхронным и асинхронным, однако condition и handler действует по разном использовании.
                // Опция args будет передана в condition при первой итерации.
                
                /* .iterator(options{
                    args Array,
                    sync false Boolean,
                    §condition.apply({ exports Object, return(reply Boolean, handlerArgs Array) Function }, conditionArgs Array) Function,
                    §handler.apply({ exports Object, return(conditionArgs...) Function }, handlerArgs Array) Function,
                    callback.call({ exports Object }) Function,
                    exports Object
                } Object) */
                
                /* .iterator(options{
                    args Array,
                    sync true Boolean,
                    §condition.apply({ exports Object, handlerArgs Array }, conditionArgs Array) Function, // => reply Boolean
                    §handler.apply({ exports Object }, handlerArgs Array) Function, // => conditionArgs Array
                    callback.call({ exports Object }) Function,
                    exports Object
                } Object) */ // => exports Object
            
                blackstone.iterator = function(options) {
                    
                    var options = lodash.defaults(options, {
                        args: [],
                        exports: {},
                        callback: function() {},
                        sync: true
                    });
                    
                    if (options.sync) {
                        var conditionArgs = options.args;
                        var handlerArgs = [];
                        
                        while ((function() {
                            
                            var context = {
                                exports: options.exports,
                                handlerArgs: []
                            };
                            
                            var result = options.condition.apply(context, conditionArgs);
                            
                            handlerArgs = context.handlerArgs;
                            
                            return result
                        })()) {
                            conditionArgs = options.handler.apply({ exports: options.exports }, handlerArgs);
                        }
                        
                        options.callback.call({ exports: options.exports });
                        
                        return options.exports;
                    
                    } else {
                        
                        var conditionReturn = function(reply, handlerArgs) {
                            if (reply) {
                                lodash.defer(function() { // no stack size exceeded
                                    options.handler.apply({
                                        exports: options.exports,
                                        return: lodash.once(handlerReturn)
                                    }, handlerArgs);
                                });
                            } else {
                                options.callback.call({ exports: options.exports });
                            }
                        };
                        
                        var handlerReturn = function() {
                            var conditionArgs = arguments;
                            
                            lodash.defer(function() {
                                options.condition.apply({ // no stack size exceeded
                                    exports: options.exports,
                                    return: lodash.once(conditionReturn)
                                }, conditionArgs);
                            });
                        }
                        
                        handlerReturn.apply(null, options.args);
                    }
                };
                
            }) (blackstone, lodash);
            // ± mocha tests/Blackstone/iterator.js -R spec
            // + async // Должен асинхронно выполнять итерации.
            // + sync // Должен синхронно выполнять итерации.
            // + stack async sync // Не должен переполнять стек вызовов.
            // + load async sync // Нагрузочное тестирование и сравнение результатов.
            
            // Путешественник
            // Переходит от переменных к переменным.
            (function(blackstone, lodash) {
                
                // Может быть синхронным и асинхронным, однако handler действует по разном использовании.
                // Опция args будет передана в handler при первой итерации.
                
                /* .traveler(options{
                    sync false Boolean,
                    §handler.apply({ exports Object, return(handlerArgs...) Function }, handlerArgs Array) Function,
                    args Array,
                    exports Object
                } Object) */
                
                /* .traveler(options{
                    sync true Boolean,
                    §handler.apply({ exports Object }, handlerArgs Array) Function, // => handlerArgs Array
                    args Array,
                    exports Object
                } Object) */ // => exports Object
                
                blackstone.traveler = function(options) {
                    
                    var options = lodash.defaults(options, {
                        sync: true
                    });
                    
                    var allow = true;
                    
                    blackstone.iterator({
                        args: options.args,
                        sync: options.sync,
                        exports: options.exports,
                        
                        condition: options.sync? (function() {
                            this.handlerArgs = arguments;
                            return allow;
                        }) : (function() {
                            this.return(true, arguments);
                        }),
                        
                        handler: options.sync? (function() {
                            var result = options.handler.apply(this, arguments);
                            if (!result) {
                                allow = false;
                                result = [];
                            }
                            return result
                        }) : options.handler
                    });
                };
                
            }) (blackstone, lodash);
            // ± mocha tests/Blackstone/traveler.js -R spec
            // + async // Должен асинхронно выполнять итерации.
            // + sync // Должен синхронно выполнять итерации.
            // + stack async sync // Не должен переполнять стек вызовов.
            // + load async sync // Нагрузочное тестирование и сравнение результатов.
            
        }) (blackstone, lodash);
        
        // Управление двусвязными списками
        // Синтетическая концепция суперпозиции позволяет наследнику Superposition находиться сразу в нескольких List.
        blackstone.lists = (function(blackstone, lodash) {
            var lists = {};
            
            var positionPrepend = function(pos) {
                if (this._prev) {
                    this._prev._next = pos;
                    pos._prev = this._prev;
                }
                this._prev = pos;
                pos._next = this;
            };
            
            var positionAppend = function(pos) {
                if (this._next) {
                    this._next._prev = pos;
                    pos._next = this._next;
                }
                this._next = pos;
                pos._prev = this;
            };
            
            var positionRemove = function() {
                if (this._prev && this._next) {
                    this._prev._next = this._next;
                    this._next._prev = this._prev;
                    
                } else if (this._prev && !this._next) {
                    this._prev._next = undefined;
                
                } else if (!this._prev && this._next) {
                    this._next._prev = undefined;
                }
                
                this._next = this._prev = undefined;
            };
            
            var listRemove = function(pos) {
                if (this._first == pos && this._last == pos) {
                    this._first = this._last = undefined;
                } else if (!this._first !== pos && this._last == pos) {
                    if (pos._prev) this._last = pos._prev;
                    else throw new Error('position is not complete');
                } else if (this._first == pos && !this._last !== pos) {
                    if (pos._next) this._first = pos._next;
                    else throw new Error('position is not complete');
                }
            };
            
            // Список двусвязных позиций
            lists.List = (function(blackstone, lodash) {
                
                // У каждого списка уникальный, в рамках экземпляра blackstone, идентификатор.
                var id = 0;
                
                // new .List()
                var List = function() {
                    this.__id = id++; // Идентификатор списка.
                    
                    // Длинна списка. Изменяется встроенными методами.
                    this._length = 0;
                    
                    // Указатели
                    this._first; // Первая позиция в списке.
                    this._last; // Последняя позиция в списке.
                };
                
                // Удаляет множество позиций суперпозиций из списка.
                List.prototype.remove = (function(blackstone, lodash) {
                    
                    // .remove(superpositions.. blackstone.lists.Superposition)
                    return function(superpositions) {
                        for (var s in superpositions) {
                            superpositions[s].in(this).remove();
                        }
                    };
                }) (blackstone, lodash);
                // ± +
                
                // Добавляет множество позиций суперпозиций в начало списка.
                List.prototype.prepend = (function(blackstone, lodash, positionPrepend) {
                    
                    var forcePrependTrue = function(list, pos) {
                        if (pos._exists) pos.remove();
                        
                        forcePrependFalse(list, pos);
                    };
                    
                    var forcePrependFalse = function(list, pos) {
                        if (pos._exists) return;
                        
                        if (list._first) {
                            positionPrepend.call(list._first, pos);
                            list._first = pos;
                        } else {
                            list._first = list._last = pos;
                        }
                        
                        list._length++;
                        pos._exists = true;
                    };
                    
                    // .prepend(superpositions.. blackstone.lists.Superposition, force = false Boolean)
                    return function(superpositions, force) {
                        var action = force? forcePrependTrue : forcePrependFalse
                        for (var s = superpositions.length-1; s > 0-1; s--) {
                            action(this, superpositions[s].in(this));
                        }
                    };
                }) (blackstone, lodash, positionPrepend);
                // ± +
                
                // Добавляет множество позиций суперпозиций в конец списка.
                List.prototype.append = (function(blackstone, lodash, positionAppend) {
                    
                    var forceAppendTrue = function(list, pos) {
                        if (pos._exists) pos.remove();
                        
                        forceAppendFalse(list, pos);
                    };
                    
                    var forceAppendFalse = function(list, pos) {
                        if (pos._exists) return;
                        
                        if (list._last) {
                            positionAppend.call(list._last, pos);
                            list._last = pos;
                        } else {
                            list._first = list._last = pos;
                        }
                        
                        list._length++;
                        pos._exists = true;
                    };
                    
                    // .append(superpositions.. blackstone.lists.Superposition, force = false Boolean)
                    return function(superpositions, force) {
                        var action = force? forceAppendTrue : forceAppendFalse
                        for (var s = 0; s < superpositions.length; s++) {
                            action(this, superpositions[s].in(this));
                        }
                    };
                }) (blackstone, lodash, positionAppend);
                // ± +
                
                // Переходит от суперпозиции к суперпозиции, от начала до конца списка или наоборот.
                // Опция order определяет направление переходов.
                List.prototype.each = (function(blackstone, lodash) {
                    
                    var conditionSync = function() {
                        if (this.exports.__pos && this.exports.__pos._exists) {
                            this.handlerArgs = [this.exports.__pos._super];
                            return true;
                        } else return false;
                    };
                    
                    var conditionAsync = function() {
                        if (this.exports.__pos && this.exports.__pos._exists) {
                            this.return(true, [this.exports.__pos._super]);
                        } else this.return(false);
                    };
                    
                    /* .each(options{
                        sync false Boolean,
                        order Boolean,
                        §handler.apply({ exports Object, return() Function }, sup blackstone.lists.Superposition) Function,
                        callback.call({ exports Object }) Function,
                        exports Object
                    } Object) */
                    
                    /* .each(options{
                        sync true Boolean,
                        order Boolean,
                        §handler.apply({ exports Object }, sup blackstone.lists.Superposition) Function,
                        callback.call({ exports Object }) Function,
                        exports Object
                    } Object) */ // => exports Object
                    return function(options) {
                        
                        var options = lodash.defaults(options, {
                            sync: true,
                            order: true,
                            exports: {}
                        });
                        
                        options.exports.__pos = options.order? this._first : this._last
                        
                        var iterated = false;
                        
                        return blackstone.iterator({
                            exports: options.exports,
                            sync: options.sync,
                            handler: options.handler,
                            callback: options.callback,
                            condition: options.order? (options.sync? (function() {
                                
                                if (!iterated) iterated = true;
                                else this.exports.__pos = this.exports.__pos._next;
                                return conditionSync.call(this);
                                
                            }) : (function() {
                                
                                if (!iterated) iterated = true;
                                else this.exports.__pos = this.exports.__pos._next;
                                return conditionAsync.call(this);
                                
                            })) : (options.sync? (function() {
                                
                                if (!iterated) iterated = true;
                                else this.exports.__pos = this.exports.__pos._prev;
                                return conditionSync.call(this);
                                
                            }) : (function() {
                                
                                if (!iterated) iterated = true;
                                else this.exports.__pos = this.exports.__pos._prev;
                                return conditionAsync.call(this);
                                
                            }))
                            
                        });
                    };
                }) (blackstone, lodash);
                // ± +
                
                /* .iterator(options{
                    order Boolean,
                } Object) */ // => superpositions.. blackstone.lists.Superposition
                List.prototype.toArray = function(options) {
                    
                    var options = lodash.defaults(lodash.isObject(options)? options : {}, {
                        order: true,
                    });
                    
                    var exports = this.each({
                        exports: { array: [] },
                        order: options.order,
                        sync: true,
                        handler: function(sup) {
                            this.exports.array.push(sup);
                        }
                    })
                    
                    return exports.array;
                    
                };
                // ± +
                
                return List;
                
            }) (blackstone, lodash);
            // ± + mocha tests/Blackstone/lists/List.js -r spec
            
            // Позиция в двусвязном списке
            // Условно не для пользовательской сборки. Позиции сами создаются при запросе положения суперпозиции в списке.
            lists.Position = (function(blackstone, lodash) {
                
                // new .Position(list blackstone.lists.List, sup blackstone.lists.Superposition)
                var Position = function(list, sup) {
                    
                    // Состояние позиции, включена ли она в список.
                    this._exists = false;
                    
                    // Указатели
                    this._prev; // Предыдущая позиция в списке.
                    this._next; // Следующая позиция в списке.
                    
                    this._list = list; // Список
                    this._super = sup; // Суперпозиция
                };
                
                // Удаляет позицию суперпозиции из списка.
                Position.prototype.remove = (function(blackstone, lodash, listRemove, positionRemove) {
                    
                    // .remove()
                    return function() {
                        if (this._exists) {
                            listRemove.call(this._list, this);
                            positionRemove.call(this);
                            this._exists = false;
                        }
                    };
                }) (blackstone, lodash, listRemove, positionRemove);
                // ± +
                
                // Добавляет множество позиций суперпозиций до позиции.
                Position.prototype.prepend = (function(blackstone, lodash, positionPrepend) {
                    
                    var forcePrependTrue = function(self, list, pos) {
                        if (pos._exists) pos.remove();
                        
                        forcePrependFalse(self, list, pos);
                    };
                    
                    var forcePrependFalse = function(self, list, pos) {
                        if (pos._exists) return;
                        
                        positionPrepend.call(self, pos);
                        
                        list._length++;
                        pos._exists = true;
                    };
                    
                    // .prepend(superpositions.. Superposition, force = false Boolean)
                    return function(superpositions, force) {
                        var action = force? forcePrependTrue : forcePrependFalse
                        if (this == this._list._first) {
                            return this._list.prepend(superpositions, force);
                            
                        } else {
                            for (var s = 0; s < superpositions.length; s++) {
                                action(this, this._list, superpositions[s].in(this._list));
                            }
                        }
                    };
                }) (blackstone, lodash, positionPrepend);
                // ± +
                
                // Добавляет множество позиций суперпозиций после позиции.
                Position.prototype.append = (function(blackstone, lodash, positionAppend) {
                    
                    var forceAppendTrue = function(self, list, pos) {
                        if (pos._exists) pos.remove();
                        
                        forceAppendFalse(self, list, pos);
                    };
                    
                    var forceAppendFalse = function(self, list, pos) {
                        if (pos._exists) return;
                        
                        positionAppend.call(self, pos);
                        
                        list._length++;
                        pos._exists = true;
                    };
                    
                    // .append(superpositions.. Superposition, force = false Boolean)
                    return function(superpositions, force) {
                        var action = force? forceAppendTrue : forceAppendFalse
                        if (this == this._list._last) {
                            return this._list.append(superpositions, force);
                            
                        } else {
                            for (var s = superpositions.length-1; s > 0-1; s--) {
                                action(this, this._list, superpositions[s].in(this._list));
                            }
                        }
                    };
                }) (blackstone, lodash, positionAppend);
                // ± +
                
                return Position;
                
            }) (blackstone, lodash);
            // ± + mocha tests/Blackstone/lists/Position.js -r spec
            
            // Суперпозиция позиций
            lists.Superposition = (function(blackstone, lodash) {
                var id = 0
                // new .Superposition()
                var Superposition = function() {
                    this.id = id++;
                    this.__lists = {}; // Ссылки на списки к которым относится суперпозиция.
                };
                
                // Возвращает позицию суперпозиции в определенном списке.
                // .in(list blackstone.lists.List) // => blackstone.lists.Position
                Superposition.prototype.in = function(list) {
                    if (this.__lists[list._id]) return this.__lists[list._id];
                    else this.__lists[list._id] = new blackstone.lists.Position(list, this);
                    
                    return this.__lists[list._id];
                };
                // ± +
                
                return Superposition;
                
            }) (blackstone, lodash);
            // ± + mocha tests/Blackstone/lists/Superposition.js -r spec
            
            return lists;
        }) (blackstone, lodash);
        // ± mocha tests/Blackstone/lists.js -R spec
        // - Вложенные тесты.
        
        return blackstone;
    };
    
    // Публичный указатель версии модуля
    // Условно доступен только для чтения.
    Blackstone._version = version;
    
    // Connector
    // Позволяет получить доступ к модулю из других модулей.
    (function(Blackstone) {
        
        // Автоматический сборщик
        (function(Blackstone) {
            
            // Define
            // Подключение с помощью модуля Require.js на клиентской стороне.
            // ~ define(['blackstone'], callback(blackstone Blackstone) Function)
            if(typeof(define) !== 'undefined' && define.amd) {
                define(['module', 'lodash'], function(module, lodash){
                    module.exports = new Blackstone(lodash);
                });
            }
            // ± google-schrome tests/Connector/Define.html
            
            // Require
            // Подключение с помощью Node.js модульной системы.
            // ~ require('blackstone')
            if(typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined' && typeof(require) == 'function') {
                module.exports = new Blackstone(require('lodash'));
            }
            // ± mocha tests/Connector/Require.js -R spec
            
        }) (Blackstone);
        // ±
        // + Возвращает завершенный экземпляр Blackstone
        
        // Ручной сборщик
        // Пользователь контролирует наличие и версию передаваемых модулей в конструктор.
        (function(Blackstone) {
            
            // Window
            // Blackstone будет доступен глобально на клиентской стороне.
            if(typeof(window) !== 'undefined') window.Blackstone = Blackstone;
            // ± google-schrome tests/Connector/Window.html
            
            // Global
            // Blackstone будет доступен глобально на серверной стороне.
            if(typeof(global) !== 'undefined') global.Blackstone = Blackstone;
            // ± mocha tests/Connector/Global.js -R spec
            
        }) (Blackstone);
        // ±
        // + Возвращает завершенный конструктор, из которого собирается завершенный экземпляр Blackstone
        
    }) (Blackstone);
    // ± tests/Connector

}) ();
// ± mocha tests/Blackstone.js -R spec
// + Не один метод не должен вызывать RangeError.
// + Не один метод не должен быть зациклен.
// + Все методы должны выполнять выполнять свою роль.
// - Вложенные тесты.

// Версии

// 0.1.0.3
// Улучшены некоторые комментарии.
// В blackstone.traveler добавлена обаботка options, и default опция sync = true.
// Чуть подправлены тесты blackstone.traveler.
// Модуль blackstone.lists.

// 0.1.0.2
// Исправлено несколько комментариев.
// Добавлен blackstone.traveler.
// Исправлен blackstone.iterator, изменено поведения condition.
// Нагрузочное тестирование асинхронных методов, стало ясно что асинхронность очень медлительна.
// Теперь default значение sync = true.

// 0.1.0.1
// Все коментарии на русском.
// Избавился от дублирования ссылок на конструктор в экземпляре blackstone.Blackstone.
// Тестирования можно вызывать одним вызовом mocha tests/Blackstone.js -R spec.
// Стандарт для blackstone.iterator.

// Правила

// Комментарии
/*
// Заголовок // Ответ на вопрос - что это?
// Описание. // Ответ на вопрос - что делает?
// ~ // Например
// § // Обязательная переменная
// (variable Constructor) // Один экземпляр Constructor
// (variables... Constructor) // Множество экземпляров Constructor
// (variables.. Constructor) // Массив экземпляров Constructor
// ([variable Constructor]) // На обязательный аргумент
// ([variable Constructor[, variable Constructor]]) // Не обязательный аргумент зависящий от другого в порядке передачи
// ([variable Constructor], [variable Constructor]) // Назависимые обязательные аргументы
// => // Описание возвращаемых данных
// ± // Состояние тестов // Если не описан - тестов нет
*/
// Предпологается что пользователь библиотеки следует инструкциям использования каждого модуля и метода.

// Описание поведения.
// `*!` нужно понять что это за переменная самим.
// `*()` список аргументов для вызова переменной.
// `new *()` метод следует использовать как конструктор
// `(variable Constructor)` variable переменная экземпляр Constructor

// Модули
/*
Каждый логический блок кода - модуль, отделяется собственным контекстом - фабрикой.
`(function() {})();`
Это позволяет четко контролировать exports и import модуля.
*/

// Префиксы
/*
`_` Системная переменная, условно доступная только для чтения.
`__` Небезопасная переменная, условно недоступная.
*/