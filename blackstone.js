// Blackstone / blackstone
// https://github.com/isglazunov/blackstone
// isglazunov / Ivan Sergeevich Glazunov / isglazunov@gmail.com

// Blackstone
(function() {
    
    // Локальный указатель версии модуля Blackstone
    var version = '0.1.0';
    
    // Конструктор Blackstone
    // new Blackstone(§lodash!) Function
    var Blackstone = function(lodash) {
        var blackstone = this;
        
        // Публичный указатель версии модуля
        // Условно доступен только для чтения.
        blackstone._version = version;
        
        // Управление двусвязными списками
        // Синтетическая концепция суперпозиции позволяет наследнику Superposition находиться сразу в нескольких List.
        blackstone.lists = (function(blackstone, lodash) {
            var lists = {};
            
            // .call(this blackstone.lists.Position, pos blackstone.lists.Position) Function
            var positionPrepend = function(pos) {
                if (this._prev) {
                    this._prev._next = pos;
                    pos._prev = this._prev;
                }
                this._prev = pos;
                pos._next = this;
            };
            
            // .call(this blackstone.lists.Position, pos blackstone.lists.Position) Function
            var positionAppend = function(pos) {
                if (this._next) {
                    this._next._prev = pos;
                    pos._next = this._next;
                }
                this._next = pos;
                pos._prev = this;
            };
            
            // .call(this blackstone.lists.Position) Function
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
            
            // Сравнение позиций в списке, и поиск нового места для позиции this.
            // .call(this blackstone.lists.Position, comparator(source blackstone.lists.Superposition, target blackstone.lists.Superposition) => Boolean Function) Function // => [parent blackstone.lists.Position, edge Boolean, moved Boolean]
            var positionCompare = function(comparator) {
                var target = this;
                
                var parent = target._prev;
                var edge = false;
                var moved = false;
                
                if (target._list._first == target) {
                    edge = true;
                    
                } else {
                    var allow = true;
                    var source = target._prev;
                    
                    while(allow) {
                        parent = source;
                        
                        if (!comparator(source._super, target._super)) {
                            moved = true;
                            
                            if (source._prev) source = source._prev;
                            else {
                                edge = true;
                                allow = false;
                            }
                        } else allow = false;
                    }
                }
                
                return [parent, edge, moved];
            };
            
            // Переместить позицию в наиболее подходящую позицию согласно условию.
            // .call(this blackstone.lists.Position, comparator(source blackstone.lists.Superposition, target blackstone.lists.Superposition) => Boolean Function) Function
            var positionSort = function(comparator) { (function(parent, edge, moved){
                if (moved) {
                    if (edge) {
                        this._list.prepend([this._super], true);
                    } else {
                        parent.append([this._super], true);
                    }
                }
            }).apply(this, positionCompare.call(this, comparator)); };
            
            // .call(this blackstone.lists.List, pos blackstone.lists.Position) Function
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
                
                // new .List() Function
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
                    
                    // .remove(superpositions.. blackstone.lists.Superposition) Function
                    return function(superpositions) {
                        for (var s in superpositions) {
                            superpositions[s].in(this).remove();
                        }
                    };
                }) (blackstone, lodash);
                
                // Добавляет множество позиций суперпозиций в начало списка.
                List.prototype.prepend = (function(blackstone, lodash, positionPrepend) {
                    
                    // (list blackstone.lists.List, pos blackstone.lists.Position) Function
                    var forcePrependTrue = function(list, pos) {
                        if (pos._exists) pos.remove();
                        
                        forcePrependFalse(list, pos);
                    };
                    
                    // (list blackstone.lists.List, pos blackstone.lists.Position) Function
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
                    
                    // .prepend(superpositions.. blackstone.lists.Superposition, force = false Boolean) Function
                    return function(superpositions, force) {
                        var action = force? forcePrependTrue : forcePrependFalse
                        for (var s = superpositions.length-1; s > 0-1; s--) {
                            action(this, superpositions[s].in(this));
                        }
                    };
                }) (blackstone, lodash, positionPrepend);
                
                // Добавляет множество позиций суперпозиций в конец списка.
                List.prototype.append = (function(blackstone, lodash, positionAppend) {
                    
                    // (list blackstone.lists.List, pos blackstone.lists.Position) Function
                    var forceAppendTrue = function(list, pos) {
                        if (pos._exists) pos.remove();
                        
                        forceAppendFalse(list, pos);
                    };
                    
                    // (list blackstone.lists.List, pos blackstone.lists.Position) Function
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
                    
                    // .append(superpositions.. blackstone.lists.Superposition, force = false Boolean)  Function
                    return function(superpositions, force) {
                        var action = force? forceAppendTrue : forceAppendFalse
                        for (var s = 0; s < superpositions.length; s++) {
                            action(this, superpositions[s].in(this));
                        }
                    };
                }) (blackstone, lodash, positionAppend);
                
                // .toArray(order Boolean) // => superpositions.. blackstone.lists.Superposition
                List.prototype.toArray = function(order) {
                    var array = [];
                    
                    if (this._first) {
                        var now = this._first;
                        do {
                            array.push(now._super);
                        } while (now._next && (now = now._next))
                    }
                    
                    return array;
                };
                
                // Добавляет множество позиций суперпозиций согласно компаратору.
                // (comparator(source blackstone.lists.Superposition, target blackstone.lists.Superposition) => Boolean Function, superposition blackstone.lists.Superposition) Function
                List.prototype.add = function(comparator, superpositions) {
                    for (var s in superpositions) {
                        superpositions[s].add(comparator);
                    }
                };
                
                // Сортирует все позиции в списке от первой до последней согласно компаратору.
                List.prototype.sort = function(comparator) {
                    var list = this;
                    
                    if (list._first) {
                        if (list._first._next) {
                            var now = this._first._next;
                            do {
                                var pos = now;
                                now = now._next;
                                positionSort.call(pos, comparator);
                            } while (now)
                        }
                    }
                };
                
                return List;
                
            }) (blackstone, lodash);
            // ± mocha tests/Blackstone/lists/List.js -r spec
            
            // Позиция в двусвязном списке
            // Условно не для пользовательской сборки. Позиции сами создаются при запросе положения суперпозиции в списке.
            lists.Position = (function(blackstone, lodash) {
                
                // new .Position(list blackstone.lists.List, sup blackstone.lists.Superposition) Function
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
                    
                    // .remove() Function
                    return function() {
                        if (this._exists) {
                            listRemove.call(this._list, this);
                            positionRemove.call(this);
                            this._exists = false;
                        }
                    };
                }) (blackstone, lodash, listRemove, positionRemove);
                
                // Добавляет множество позиций суперпозиций до позиции.
                Position.prototype.prepend = (function(blackstone, lodash, positionPrepend) {
                    
                    // (self blackstone.lists.Position, list blackstone.lists.List, pos blackstone.lists.Position) Function
                    var forcePrependTrue = function(self, list, pos) {
                        if (pos._exists) pos.remove();
                        
                        forcePrependFalse(self, list, pos);
                    };
                    
                    // (self blackstone.lists.Position, list blackstone.lists.List, pos blackstone.lists.Position) Function
                    var forcePrependFalse = function(self, list, pos) {
                        if (pos._exists) return;
                        
                        positionPrepend.call(self, pos);
                        
                        list._length++;
                        pos._exists = true;
                    };
                    
                    // .prepend(superpositions.. Superposition, force = false Boolean) Function
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
                
                // Добавляет множество позиций суперпозиций после позиции.
                Position.prototype.append = (function(blackstone, lodash, positionAppend) {
                    
                    // (self blackstone.lists.Position, list blackstone.lists.List, pos blackstone.lists.Position) Function
                    var forceAppendTrue = function(self, list, pos) {
                        pos.remove();
                        forceAppendFalse(self, list, pos);
                    };
                    
                    // (self blackstone.lists.Position, list blackstone.lists.List, pos blackstone.lists.Position) Function
                    var forceAppendFalse = function(self, list, pos) {
                        if (pos._exists) return;
                        
                        positionAppend.call(self, pos);
                        
                        list._length++;
                        pos._exists = true;
                    };
                    
                    // .append(superpositions.. Superposition, force = false Boolean) Function
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
                
                // Добавляет позицию в список, либо пересортирует ее в списке согласно компаратору.
                // (comparator(source blackstone.lists.Superposition, target blackstone.lists.Superposition) => Boolean Function) Function // => blackstone.lists.Position
                Position.prototype.add = function(comparator) {
                    this._list.append([this._super], true);
                    positionSort.call(this, comparator);
                    return this;
                };
                
                return Position;
                
            }) (blackstone, lodash);
            // ± mocha tests/Blackstone/lists/Position.js -r spec
            
            // Суперпозиция позиций
            lists.Superposition = (function(blackstone, lodash) {
                
                // new .Superposition() Function
                var Superposition = function() {
                    this.__lists = {}; // Ссылки на списки к которым относится суперпозиция.
                };
                
                // Возвращает позицию суперпозиции в определенном списке.
                // .in(list blackstone.lists.List) Function // => blackstone.lists.Position
                Superposition.prototype.in = function(list) {
                    if (this.__lists[list._id]) return this.__lists[list._id];
                    else this.__lists[list._id] = new blackstone.lists.Position(list, this);
                    
                    return this.__lists[list._id];
                };
                
                return Superposition;
                
            }) (blackstone, lodash);
            // ± mocha tests/Blackstone/lists/Superposition.js -r spec
            
            return lists;
        }) (blackstone, lodash);
        // ± mocha tests/Blackstone/lists.js -R spec
        
        // Событийная система построенная на двусвязных списках
        blackstone.events = (function(blackstone, lodash) {
            var events = {};
            
            // Позиция в списке обработчиков.
            // Условно не для пользовательской сборки. Позиции сами создаются при запросе положения обарботчика в событии.
            events.Position = (function(blackstone, lodash, events) {
                
                // new .Position(event events.Event, handler events.Handler) Function
                var Position = function(event, handler) {
                    blackstone.lists.Position.call(this, event, handler);
                };
                
                // Наследник позиции.
                Position.prototype = new blackstone.lists.Position;
                
                // Создает новый обработчик перед этим обработчиком.
                Position.prototype.before = function(method) {
                    var handler = new events.Handler(method);
                    this.prepend([handler]);
                    return handler;
                };
                
                // Создает новый обработчик после этого обработчика.
                Position.prototype.after = function(method) {
                    var handler = new events.Handler(method);
                    this.append([handler]);
                    return handler;
                };
                
                return Position;
            }) (blackstone, lodash, events);
            
            // Один обработчик события.
            events.Handler = (function(blackstone, lodash, events) {
                
                // new .Handler(method(arguments...) Function) Function
                var Handler = function(method) {
                    blackstone.lists.Superposition.call(this);
                    
                    this._method = method;
                };
                
                // Наследник суперпозиции.
                Handler.prototype = new blackstone.lists.Superposition;
                
                // Вызов обработчика.
                // .trigger(event events.Event, args Arguments) Function
                Handler.prototype.trigger = function(event, args) {
                    this._method.apply(event, args);
                };
                
                // Возвращает позицию обработчика в определенном событии.
                // .in(event events.Event) Function // => events.Position
                Handler.prototype.in = function(event) {
                    if (this.__lists[event._id]) return this.__lists[event._id];
                    else this.__lists[event._id] = new events.Position(event, this);
                    
                    return this.__lists[event._id];
                };
                
                return Handler;
            }) (blackstone, lodash, events);
            
            // Список обработчиков событий.
            // Предоставляет интерфейс управления событиями.
            events.Event = (function(blackstone, lodash, events) {
                
                // new .Event(emitter events.Emitter) Function
                var Event = function(emitter) {
                    blackstone.lists.List.call(this);
                    
                    this._emitter = emitter;
                };
                
                // Наследник двусвязного списка.
                // Должен содержать только экземпляры events.Handler!
                Event.prototype = new blackstone.lists.List;
                
                // Вызывает событие, запускает все обработчики в списке.
                // .trigger(arguments...) Function
                Event.prototype.trigger = function() {
                    var event = this;
                    var args = arguments;
                    
                    if (this._first) {
                        var now = this._first;
                        do {
                            now._super.trigger(event, args);
                        } while (now._next && (now = now._next))
                    }
                };
                
                // Создает новый обработчик в конце списка.
                // .bind(method(arguments...) Function) Function
                Event.prototype.bind = Event.prototype.after = function(method) {
                    var handler = new events.Handler(method);
                    this.append([handler]);
                    return handler;
                };
                
                // Создает новый обработчик в начале списка.
                Event.prototype.before = function(method) {
                    var handler = new events.Handler(method);
                    this.prepend([handler]);
                    return handler;
                };
                
                return Event;
            }) (blackstone, lodash, events);
            
            // Тот кто вызывает события
            events.Emitter = (function(blackstone, lodash, events) {
                
                // new .Emitter() Function
                var Emitter = function() {
                    this._events = {}; // Хеш с ключами по которым можно обратиться к спискам в которых содержаться обработчики.
                };
                
                // Предоставляет доступ к управлению событием
                // .on(name String) Function // => events.Event
                Emitter.prototype.on = function(name) {
                    if (!this._events[name]) this._events[name] = new events.Event(this);
                    
                    return this._events[name];
                };
                
                return Emitter;
            }) (blackstone, lodash, events);
            
            return events;
        }) (blackstone, lodash);
        // ± mocha tests/Blackstone/events.js -R spec
        
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
    // ± + tests/Connector

}) ();
// ± mocha tests/Blackstone.js -R spec
// + Не один метод не должен вызывать RangeError.
// + Не один метод не должен быть зациклен.
// + Все методы должны выполнять выполнять свою роль.
// - Вложенные тесты.

// Заметки
// Возможно можно улучшить метод eachAllPrototypes убрав из него вложенные вызовы.

// Версии

// 0.1.0
// На этой версии библиотека заморожена.

// 0.1.0.6
// Уничтожен инструментарий traveler и iterator вместе с его тестами. Все кто его использовал переведены на while...
// Принято решение к будущему разделению библиотеки на списки и события.

// 0.1.0.5
// Добавлен событий blackstone.events.

// 0.1.0.4
// Добавлена сортировка в blackstone.lists.
// Улучшено комментирование.
// Убраны тестовые идентификаторы суперпозиций.
// Переписаны тесты blackstone.lists.

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