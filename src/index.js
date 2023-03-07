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

const AppAction = {
    inc: 'inc',
    dec: 'dec',
    save: 'save',
    remove: 'remove',
};

function appReducer(state, action) {
    switch(action) {
    case AppAction.inc:
        state.count += 1;
        break;

    case AppAction.dec:
        state.count -= 1;
        break;

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

const appState = AppState();
const store = Store.of(appState, appReducer);

store.send(AppAction.inc);
console.log(store.value);

store.send(AppAction.save);
console.log(store.value);

store.send(AppAction.inc);
console.log(store.value);

store.send(AppAction.save);
console.log(store.value);

store.send(AppAction.remove);
console.log(store.value);

store.send(AppAction.dec);
console.log(store.value);

