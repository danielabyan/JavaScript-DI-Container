/**
 * ContainerDi object
 * Simple dependency injection container for JS.
 *
 * @param {DiContainerTypeValidator} diContainerTypeValidator
 * @constructor
 */
var DiContainer = function (diContainerTypeValidator) {

    if (!diContainerTypeValidator) {
        throw 'DiContainer constructor argument not set';
    } else if (typeof diContainerTypeValidator !== 'object' || !diContainerTypeValidator instanceof DiContainerTypeValidator) {
        throw 'DiContainer constructor argument should be DiContainerTypeValidator instance';
    }

    /**
     * @type {DiContainerTypeValidator}
     */
    this.typeValidator = diContainerTypeValidator;
};

/**
 * @type {{get, addBoolean, addString, addNumber, addObject}}
 */
DiContainer.prototype = (function () {

    var _this = this;

    /**
     * Container items types list
     *
     * @type {{object: string, number: string, boolean: string, string: string}}
     * @private
     */
    var _types = {
        object: 'object',
        number: 'number',
        boolean: 'boolean',
        string: 'string'
    };

    /**
     * @type {{}}
     * @private
     */
    var _container = {};

    /**
     * Get value from container by alias
     *
     * @param {string} dependency
     * @private
     */
    function _getValueFromContainerByAlias(dependency) {
        var path = dependency.split('.');
        var value = {container: _container};
        var key = null;
        for (var i in path) {

            if (!value.hasOwnProperty(path[i])) {
                throw 'Invalid dependency. {' + dependency + '}. Key {' + path[i] + '} not found.';
            }

            value = value[path[i]];
            key = path[i];
        }

        return value.value;
    }

    return {

        /**
         * Check is item found in container
         *
         * @param {string} containerItemName
         * @returns {boolean}
         */
        has: function (containerItemName) {
            return _container.hasOwnProperty(containerItemName) || this.typeValidator.isContainerAlias(containerItemName);
        },

        /**
         * Get value from container
         *
         * @param {string} containerItemName
         */
        get: function (containerItemName) {

            if(containerItemName == 'container') {
                return this;
            }

            var containerItem = null;

            if (this.has(containerItemName)) {
                containerItem = _container[containerItemName];
            } else if (this.typeValidator.isContainerAlias(containerItemName)) {
                containerItem = _getValueFromContainerByAlias(containerItemName);
            } else {
                throw 'Value in container not found';
            }

            /**
             * If container item type is object and it not initialised - initialise object
             */
            if (containerItem.type == _types.object && !containerItem.value) {
                var objectBuilder = new DiContainerObjectBuilder();
                objectBuilder.setDiContainer(this);
                objectBuilder.setObjectConstructorArguments(containerItem.with);
                objectBuilder.setTypeValidator(this.typeValidator);
                objectBuilder.setObjectName(containerItemName);

                containerItem.value = objectBuilder.build().getObject();
                if (containerItem.callback) {
                    containerItem.callback(this, containerItem.value);
                }
            }

            return containerItem.value;
        },

        /**
         * Add boolean value to container
         *
         * @param {string} containerBooleanItemName
         * @param {boolean} value
         */
        addBoolean: function (containerBooleanItemName, value) {
            this.typeValidator.validateContainerItemName(containerBooleanItemName);
            containerBooleanItemName = this.typeValidator.validateContainerBooleanItem(value);

            _container[containerBooleanItemName] = {
                value: value,
                type: _types.boolean
            }
        },

        /**
         * Add string value to container
         *
         * @param {string} containerStringItemName
         * @param {string} value
         */
        addString: function (containerStringItemName, value) {
            this.typeValidator.validateContainerItemName(containerStringItemName);
            containerStringItemName = this.typeValidator.validateContainerStringItem(value);

            _container[containerStringItemName] = {
                value: value,
                type: _types.string
            }
        },

        /**
         * Add numerical value to container
         *
         * @param {string} containerNumberItemName
         * @param {number} value
         */
        addNumber: function (containerNumberItemName, value) {
            this.typeValidator.validateContainerItemName(containerNumberItemName);
            containerNumberItemName = this.typeValidator.validateContainerNumberItem(value);

            _container[containerNumberItemName] = {
                value: value,
                type: _types.number
            }
        },

        /**
         * Add object to container
         *
         * @param {string} containerObjectItemName
         * @param {object} configs
         */
        addObject: function (containerObjectItemName, configs) {
            containerObjectItemName = this.typeValidator.validateContainerItemName(containerObjectItemName);
            configs = this.typeValidator.validateContainerObjectConfig(configs);
            configs.type = _types.object;

            _container[containerObjectItemName] = configs;

            if (configs.autoload) {
                var objectBuilder = new DiContainerObjectBuilder();
                objectBuilder.setDiContainer(this);
                objectBuilder.setObjectConstructorArguments(configs.with);
                objectBuilder.setTypeValidator(this.typeValidator);
                objectBuilder.setObjectName(containerObjectItemName);

                _container[containerObjectItemName].value = objectBuilder.build().getObject();
                if (configs.callback) {
                    configs.callback(this, _container[containerObjectItemName].value);
                }
            }
        },

        /**
         * Add object to container
         *
         * @param {string} containerObjectItemName
         * @param {object} objectInstance
         */
        addObjectWithInstance: function (containerObjectItemName, objectInstance) {
            containerObjectItemName = this.typeValidator.validateContainerItemName(containerObjectItemName);
            if (!objectInstance) {
                throw 'Object instance can not be empty';
            } else if (typeof objectInstance !== 'object') {
                throw 'Object instance should be object type instance';
            }

            _container[containerObjectItemName] = {
                value: objectInstance,
                autoload: false,
                callback: null,
                with: [],
                type: _types.object
            }
        }
    };
})();