// Blackstone / blackstone
// https://github.com/isglazunov/blackstone
// isglazunov / Ivan Sergeevich Glazunov / isglazunov@gmail.com

// Blackstone
(function() {
    
    // Локальный указатель версии модуля Blackstone
    var version = '0.1.0.1';
    
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
                
                // Может быть синхронным и асинхронным, однако condition и handler действует по разному при синхронном и асинхронном использовании.
                
                // Async
                /* .iterator(options{
                    sync: false Boolean
                    §condition.apply({ exports Object, return(reply Boolean, handlerArgs Array) Function }, conditionArgs Array) Function,
                    §handler.apply({ exports Object, return(conditionArgs...) Function }, handlerArgs Array) Function,
                    callback.call({ exports Object }) Function,
                    exports Object
                } Object) */
                
                // Sync
                /* .iterator(options{
                    sync: true Boolean
                    §condition.apply({ exports Object }, conditionArgs Array) Function, // => [reply Boolean, handlerArgs Array]
                    §handler.apply({ exports Object }, handlerArgs Array) Function, // => conditionArgs Array
                    callback.call({ exports Object }) Function,
                    exports Object
                } Object) */ // => exports Object
            
                blackstone.iterator = function(options) {
                    
                    var options = lodash.defaults(options, {
                        exports: {},
                        callback: function() {},
                        sync: false
                    });
                    
                    if (options.sync) {
                        var conditionArgs = [];
                        var handlerArgs = [];
                        
                        while ((function() {
                            
                            var result = options.condition.apply({
                                exports: options.exports
                            }, conditionArgs);
                            
                            handlerArgs = result.handlerArgs;
                            return result.reply;
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
                        
                        handlerReturn();
                    }
                };
                
            }) (blackstone, lodash);
            // ± mocha tests/Blackstone/iterator.js -R spec
            // + async // Должен асинхронно выполнять итерации.
            // + sync // Должен синхронно выполнять итерации.
            // + stack async sync // Не должен переполнять стек вызовов.
            
        }) (blackstone, lodash);
        
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

// Версии

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