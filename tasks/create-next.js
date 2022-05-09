#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const cp = require("child_process");

const rootDir = path.join(__dirname, "..");
const packagesDir = path.join(rootDir, "packages");

const args = process.argv.slice(2);

const craScriptPath = path.join(packagesDir, "create-next", "index.js");

cp.execSync(
    `LOCAL_DEBUG=true node --experimental-json-modules ${craScriptPath} ${args.join(" ")}`,
    {
        cwd: rootDir,
        stdio: "inherit",
    }
);
