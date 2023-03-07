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

// (Value, Action) -> Void,
// WritableKeyPath
// CasePath
function pullback(reducer, value, action) {
    return function(globalValue, globalAction) {
        const localAction = globalAction[action];
        if(!localAction) return;

        reducer(globalValue[value], localAction);
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

const AppAction = {
    inc: 'inc',
    dec: 'dec',
    save: 'save',
    remove: 'remove',
};

function counterReducer(state, action) {
    switch(action) {
    case AppAction.inc:
        state.count += 1;
        break;

    case AppAction.dec:
        state.count -= 1;
        break;

    default:
        break;
    }
}

function primesReducer(state, action) {
    switch(action) {
    case AppAction.save:
        state.primes.push(state.count);
        break;

    case AppAction.remove:
        state.primes.splice(state.primes.indexOf(state.count));
        break;

    default:
        break;
    }
}

const appState = AppState();
const appReducer = combine([
    counterReducer,
    primesReducer,
]);
const store = Store.of(appState, appReducer);

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
    appReducer,
    store,
}

