#!/usr/bin/env node


if (process.env.LOCAL_DEBUG) {
    import("./src/index.js");
} else {
    import("./dist/index.js");
}
