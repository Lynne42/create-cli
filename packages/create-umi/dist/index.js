#!/usr/bin/env node
"use strict";
function _getRequireWildcardCache(a) {
    if ("function" != typeof WeakMap) return null;
    var b = new WeakMap(),
        c = new WeakMap();
    return (_getRequireWildcardCache = function (a) {
        return a ? c : b;
    })(a);
}
function _interopRequireWildcard(a, b) {
    if (!b && a && a.__esModule) return a;
    if (null === a || ("object" != typeof a && "function" != typeof a)) return { default: a };
    var c = _getRequireWildcardCache(b);
    if (c && c.has(a)) return c.get(a);
    var d = {},
        e = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for (var f in a)
        if ("default" != f && Object.prototype.hasOwnProperty.call(a, f)) {
            var g = e ? Object.getOwnPropertyDescriptor(a, f) : null;
            g && (g.get || g.set) ? Object.defineProperty(d, f, g) : (d[f] = a[f]);
        }
    return (d.default = a), c && c.set(a, d), d;
}
Promise.resolve().then(() => _interopRequireWildcard(require("./initProgram.js")));
const init = () => {
    var a = process.versions.node,
        b = a.split("."),
        c = b[0];
    10 > c &&
        (console.error(
            "You are running Node " +
                a +
                ".\nCreate React App requires Node 10 or higher. \nPlease update your version of Node."
        ),
        process.exit(1));
};
init();
