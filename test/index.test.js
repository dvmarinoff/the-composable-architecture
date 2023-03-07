import { describe, expect, test } from 'vitest';

import {
    Store, combine, pullback,
    AppAction, AppState, counterReducer, primesReducer, logging, appReducer,
} from '../src/index.js';

import {
    compose2, compose, pipe, curry2,
} from '../src/lib/functions.js';

describe('Count', () => {
    const appState = AppState();
    const appReducer = combine([
        counterReducer,
        primesReducer,
    ]);
    const store = Store.of(appState, logging(appReducer));

    describe.only('inc', () => {
        test('starts at 0', () => {
            expect(store.value.count).toEqual(0);
        });

        test('inc to 1', () => {
            store.send(AppAction.Counter.inc);
            expect(store.value.count).toEqual(1);
        });

        test('inc to 2', () => {
            store.send(AppAction.Counter.inc);
            expect(store.value.count).toEqual(2);
        });
    });

    describe('dec', () => {
        test('dec from 2 to 1', () => {
            store.send(AppAction.Counter.dec);
            expect(store.value.count).toEqual(1);
        });

        test('dec from 1 to 0', () => {
            store.send(AppAction.Counter.dec);
            expect(store.value.count).toEqual(0);
        });
    });
});

describe('Primes', () => {
    const appState = AppState();
    const appReducer = combine([counterReducer, primesReducer]);
    const store = Store.of(appState, appReducer);

    describe('save', () => {
        test('starts empty', () => {
            expect(store.value.primes.length).toEqual(0);
            expect(store.value.primes[0]).toEqual(undefined);
        });

        test('save 3', () => {
            store.send(AppAction.Counter.inc); // 1
            store.send(AppAction.Counter.inc); // 2
            store.send(AppAction.Counter.inc); // 3
            store.send(AppAction.Primes.save); // -> 3
            expect(store.value.primes.length).toEqual(1);
            expect(store.value.primes[0]).toEqual(3);
        });

        test('save 7', () => {
            store.send(AppAction.Counter.inc); // 4
            store.send(AppAction.Counter.inc); // 5
            store.send(AppAction.Counter.inc); // 6
            store.send(AppAction.Counter.inc); // 7
            store.send(AppAction.Primes.save); // -> 7
            expect(store.value.primes.length).toEqual(2);
            expect(store.value.primes[0]).toEqual(3);
            expect(store.value.primes[1]).toEqual(7);
        });
    });

    describe('remove', () => {
        test('remove 7', () => {
            store.send(AppAction.Primes.remove); // -> 7
            expect(store.value.primes.length).toEqual(1);
            expect(store.value.primes[0]).toEqual(3);
            expect(store.value.primes[1]).toEqual(undefined);
        });
    });
});

