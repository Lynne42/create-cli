#!/usr/bin/env node

"use strict";

import process from "process";
import { Command } from "commander/esm.mjs";

import creatReact from "./creatReact.js";

import packageJson from "../package.json" assert { type: "json" };
const program = new Command();

program.version(packageJson.version);

// 命令辅助信息
program
    .version(packageJson.version, "-v, --vers", "output the current version")
    .description("Initialize a ts project based on umi")
    .option("--info", "print environment debug info")
    .option("-projectName, --projectName <dir>", "Enter project name")
    .argument("[projectName]", "project name", "my-app")
    .action((projectName, options) => {
        console.log("action projectName:", projectName, options);
        creatReact(projectName);
    })
    .parse(process.argv);

const options = program.opts();
console.log(`options params: ${options.projectName}`);
