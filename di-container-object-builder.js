/**
 * DiContainerObjectBuilder object
 *
 * @constructor
 */
var DiContainerObjectBuilder = function () {
};

/**
 * @type {{setDiContainer, setTypeValidator, setObjectName, setObjectConstructorArguments, build, getObject}}
 */
DiContainerObjectBuilder.prototype = (function () {

    /**
     * DiContainer for access dependencies of object
     *
     * @type {DiContainer}
     * @private
     */
    var _diContainer = null;

    /**
     * Object validator
     *
     * @type {DiContainerTypeValidator}
     * @private
     */
    var _typeValidator = null;

    /**
     * Object name
     *
     * @type {string}
     * @private
     */
    var _objectName = null;

    /**
     * Created object
     *
     * @type {object}
     * @private
     */
    var _createdObject = null;

    /**
     * Arguments list for initialise object
     *
     * @type {Array}
     * @private
     */
    var _objectConstructArgs = [];

    /**
     * Prepare arguments list
     *
     * @private
     */
    var _prepareConstructorArguments = function () {
        var preparedArgs = [];

        for (var i in _objectConstructArgs) {
            var objectInitArg = _objectConstructArgs[i];
            if (typeof objectInitArg === 'string') {
                if (_typeValidator.isContainerAlias(objectInitArg)) {
                    preparedArgs.push(_diContainer.get(objectInitArg));
                } else {
                    preparedArgs.push(objectInitArg);
                }
            } else {
                preparedArgs.push(objectInitArg);
            }
        }

        _objectConstructArgs = preparedArgs;
    };

    return {

        /**
         * Set dependency container for access object dependencies
         *
         * @param {DiContainer} diContainer
         */
        setDiContainer: function (diContainer) {
            if (!diContainer) {
                throw 'Dependency container can not be empty';
            } else if (typeof diContainer !== 'object' || !diContainer instanceof DiContainer) {
                throw 'Given argument not instance of DiContainer';
            }

            _diContainer = diContainer;
        },

        /**
         * Set type validator
         *
         * @param {DiContainerTypeValidator} typeValidator
         */
        setTypeValidator: function (typeValidator) {
            if (!typeValidator) {
                throw 'Type validator can not be empty';
            } else if (typeof typeValidator !== 'object' || !typeValidator instanceof DiContainerTypeValidator) {
                throw 'Given argument not instance of TypeValidator';
            }

            _typeValidator = typeValidator;
        },

        /**
         * Set object name
         *
         * @param {string} objectName
         */
        setObjectName: function (objectName) {
            if (!objectName) {
                throw 'Object name can\'t be empty';
            } else if (typeof objectName !== 'string') {
                throw 'Object name should be string type instance';
            }

            _objectName = objectName;
        },

        /**
         * Set object constructor arguments
         *
         * @param constructorArguments
         */
        setObjectConstructorArguments: function (constructorArguments) {
            if (typeof constructorArguments !== 'object' || constructorArguments.constructor !== Array) {
                throw 'Object constructor arguments list should be Array type instance';
            }

            _objectConstructArgs = constructorArguments;
        },

        /**
         * Build object
         *
         * @returns {DiContainerObjectBuilder}
         */
        build: function () {
            if (!_objectName) {
                throw 'Before build object set object name';
            }

            if (!_diContainer) {
                throw 'Before build object set DiContainer';
            }

            if (!_typeValidator) {
                throw 'Before build object set TypeValidator';
            }

            _prepareConstructorArguments();

            var objectInitArgsInStringFormat = [];
            for (var i = 0; i < _objectConstructArgs.length; i++) {
                objectInitArgsInStringFormat.push('_objectConstructArgs[' + i + ']');
            }

            var evalString = 'new ' + _objectName + '(' + objectInitArgsInStringFormat.join(',') + ')';
            var newObject = eval(evalString);
            if (!newObject) {
                throw 'Fail create {' + _objectName + '} object';
            }

            if (newObject.setContainer && typeof newObject.setContainer === 'function') {
                newObject.setContainer(_diContainer);
            }

            _createdObject = newObject;

            return this;
        },

        /**
         * Get created object
         *
         * @returns {object}
         */
        getObject: function () {
            if (!_createdObject) {
                throw 'Before getting object - build it';
            }

            return _createdObject;
        }
    };
})();