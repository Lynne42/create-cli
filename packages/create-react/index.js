#!/usr/bin/env node

if (process.env.LOCAL_DEBUG) {
    require("./src/index.js");
} else {
    require("./dist/index.js");
}

