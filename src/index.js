// Architecture Layer
class Store {
    constructor(value, reducer) {
        this.value = value;
        this.reducer = reducer;
    }

    static of(value, reducer) {
        return new Store(value, reducer);
    }

    send(action) {
        this.reducer(this.value, action);
    }
}

// [(Value, Action) -> Void]
function combine(reducers = []) {
    // (Value, Action) -> Void
    return function(value, action) {
        reducers.forEach(reducer => reducer(value, action));
    };
}

// TODO: pullback
// (Value, Action) -> Void,
// WritableKeyPath
// CasePath
function pullback(reducer, value) {
    return function(globalValue, globalAction) {
        reducer(globalValue[value], globalAction);
    };
}

// END Architecture Layer

function AppState() {
    let count = 0;
    let primes = [];
    let activity = [];

    return {
        count,
        primes,
        activity,
    };
}

const CounterAction = {
    inc: 'inc',
    dec: 'dec',
};

const PrimesAction = {
    save: 'save',
    remove: 'remove',
};

const AppAction = {
    Counter: CounterAction,
    Primes: PrimesAction,
};

function counterReducer(state, action) {
    switch(action) {
    case AppAction.Counter.inc:
        state.count += 1;
        break;

    case AppAction.Counter.dec:
        state.count -= 1;
        break;

    default:
        break;
    }
}

function primesReducer(state, action) {
    switch(action) {
    case AppAction.Primes.save:
        state.primes.push(state.count);
        break;

    case AppAction.Primes.remove:
        state.primes.splice(state.primes.indexOf(state.count));
        break;

    default:
        break;
    }
}

// Higher Order Reducers
// ((Value, Action) -> Void) -> ((Value, Action) -> Void)
function logging(reducer) {
    return function(value, action) {
        reducer(value, action);
        console.log(`action: ${action}`);
        console.log(`state: `, value);
        console.log(`----------`);
    };
}
// END Higher Order Reducers

const appState = AppState();

const appReducer = combine([
    counterReducer,
    primesReducer,
]);

const store = Store.of(appState, logging(appReducer));

export {
    Store,
    combine,
    pullback,

    AppAction,
    CounterAction,
    PrimesAction,
    AppState,

    appState,
    counterReducer,
    primesReducer,
    logging,
    appReducer,
    store,
}

