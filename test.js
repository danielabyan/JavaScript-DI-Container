/**
 * @param {string} message
 */
var log = function (message) {
    console.log(message);
};

log('Test: Start DI test');
log('Test: Check is DiContainer exists on my scope');
if (window.DiContainer) {
    log('Success: DiContainer found. ');
    log('Test: Init DIContainer');

    var DI = new DiContainer(new DiContainerTypeValidator());

    log('Test: Add initialised object to container');

    var Mars = function () {
    };
    Mars.prototype = {
        color: 'Red'
    };
    var InitialisedMars = new Mars();

    DI.addObjectWithInstance('Mars', InitialisedMars);

    var MarsFromContainer = DI.get('Mars');

    if (MarsFromContainer instanceof Mars) {
        log('Success: Initialised object success added to container');
    } else {
        log('Error: Fail add initialised object to container');
    }

    log('Test: Add not initialised object to Di');

    var Car = function () {
    };
    Car.prototype = {
        color: 'red',
        model: 'S'
    };

    DI.addObject('Car', Car);

    var CarFromContainer = DI.get('Car');
    if (CarFromContainer instanceof Car) {
        log('Success: Initialised object success added to container');
    } else {
        log('Error: Fail add initialised object to container');
    }

    log('Test: Test simple types');

    DI.addNumber('Pi', 3.14);

    var pi = DI.get('Pi');
    if (pi == 3.14) {
        log('Success: Number success stored/fetched to container');
    } else {
        log('Error: Fail store/fetch number to/from container');
    }

    DI.addBoolean('True', true);

    var boolTrue = DI.get('True');
    if (boolTrue == true) {
        log('Success: Boolean success stored/fetched to container');
    } else {
        log('Error: Fail store/fetch boolean to/from container');
    }

    DI.addString('Lorem', 'Ipsum');

    var lorem = DI.get('Lorem');
    if (lorem == 'Ipsum') {
        log('Success: String success stored/fetched to container');
    } else {
        log('Error: Fail store/fetch string to/from container');
    }

    log('Finish test');
} else {
    log('Error: DI not found');
}