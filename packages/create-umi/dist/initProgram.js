#!/usr/bin/env node
"use strict";
var _process = _interopRequireDefault(require("process")),
    _esm = require("commander/esm.mjs"),
    _creatReact = _interopRequireDefault(require("./creatReact.js")),
    _package = _interopRequireDefault(require("../package.json"));
function _interopRequireDefault(a) {
    return a && a.__esModule ? a : { default: a };
}
const program = new _esm.Command();
program.version(_package.default.version),
    program
        .version(_package.default.version, "-v, --vers", "output the current version")
        .description("Initialize a ts project based on umi")
        .option("--info", "print environment debug info")
        .option("-projectName, --projectName <dir>", "Enter project name")
        .argument("[projectName]", "project name", "my-app")
        .action((a, b) => {
            console.log("action projectName:", a, b), (0, _creatReact.default)(a);
        })
        .parse(_process.default.argv);
const options = program.opts();
console.log(`options params: ${options.projectName}`);
