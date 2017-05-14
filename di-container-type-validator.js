/**
 * DiContainerTypeValidator object
 *
 * @constructor
 */
var DiContainerTypeValidator = function () {};

/**
 * @type {{validateContainerItemName, validateContainerObjectConfig, validateContainerNumberItem, validateContainerStringItem, validateContainerBooleanItem, isContainerAlias}}
 */
DiContainerTypeValidator.prototype = (function () {
    return {

        /**
         * Validate container item name
         *
         * @param name
         * @returns {string}
         */
        validateContainerItemName: function (name) {
            if (typeof name !== 'string') {
                throw 'Container item name should be string type instance';
            } else if (!name) {
                throw 'Container item name for object can\' be empty';
            }

            return name;
        },

        /**
         * Check container object object type item configs
         *
         * @param configs
         * @returns {{value:object|null, autoload: boolean, with: array, callback: function, type: string}}
         */
        validateContainerObjectConfig: function (configs) {
            if (configs) {
                if (!typeof configs === 'object') {
                    throw 'Object configs should be object instance';
                }
            } else {
                configs = {};
            }

            if (configs.hasOwnProperty('value')) {
                if (typeof configs.value !== 'object') {
                    throw 'Object should be instance of object';
                }
            } else {
                configs.value = null;
            }

            if (configs.hasOwnProperty('autoload')) {
                if (typeof configs.autoload !== 'boolean') {
                    throw 'Autoload value for object should be boolean';
                }
            } else {
                configs.autoload = false;
            }

            if (configs.hasOwnProperty('with')) {
                var objectInitArgs = configs.with;
                if (typeof objectInitArgs === 'object' && objectInitArgs.constructor !== Array) {
                    throw 'Config {with} for object should be array type instance';
                }
            } else {
                configs.with = [];
            }

            if (configs.hasOwnProperty('callback')) {
                if (typeof configs.callback !== 'function') {
                    throw 'Call function should be function type';
                }
            } else {
                configs.callback = null;
            }

            return configs;
        },

        /**
         * Validate container number item type
         *
         * @param number
         * @returns {number}
         */
        validateContainerNumberItem: function (number) {
            if(number % 1 !== 0) {
                throw 'Container number item should be number type instance';
            }

            return number;
        },

        /**
         * Validate container string item type
         *
         * @param string
         * @returns {string}
         */
        validateContainerStringItem: function (string) {
            if (typeof string !== 'string') {
                throw 'Container string item should be string type instance';
            }

            return string;
        },

        /**
         * Validate container boolean item type
         *
         * @param boolean
         * @returns {boolean}
         */
        validateContainerBooleanItem: function (boolean) {
            if(typeof boolean !== 'boolean') {
                throw 'Container boolean item should be boolean type instance';
            }

            return boolean;
        },

        /**
         * Check string is alias for container item
         *
         * @param {string} alias
         * @returns {boolean}
         */
        isContainerAlias: function (alias) {
            return alias.indexOf('container.') === 0 || alias === 'container';
        }
    };
})();