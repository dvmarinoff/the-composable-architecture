function equals(a, b) {
    return Object.is(a, b);
}

function exists(x) {
    if(equals(x, undefined) || equals(x, null)) return false;
    return true;
}

function isString(x) {
    return equals(typeof x, 'string');
}

function compose2(f, g) {
    return function(...args) {
        return f(g(...args));
    };
}

function compose(...fns) {
    return fns.reduce(compose2);
}

function pipe(...fns) {
    return fns.reduceRight(compose2);
}

function curry2(fn) {
    return function (arg1, arg2) {
        if(exists(arg2)) {
            return fn(arg1, arg2);
        } else {
            return function(arg2) {
                return fn(arg1, arg2);
            };
        }
    };
}

const nth = curry2(function(offset, xs) {
    let i = (offset < 0) ? (xs.length + offset) : (offset);
    if(isString(xs)) {
        return xs.charAt(i);
    }
    return xs[i];
});

const prop = curry2(function(p, x) {
    if(!exists(x)) return;
    return Number.isInteger(p) ? nth(p, x) : x[p];
});

function first(xs) {
    return nth(0)(xs);
}

function last(xs) {
    return nth(-1)(xs);
}

const f = {
    '_': {'@@functional/placeholder': true},
    'q': function(value) { return function() {return value;}; },
    'I': (x) => x,
    'true': (x) => true,
    'false': (x) => false,
    'equals': curry2(equals),
};

export {
    equals,
    exists,
    compose,
    compose2,
    pipe,
    curry2,
    nth,
    first,
    last,
    prop,
    f,
};
