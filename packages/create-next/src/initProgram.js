#!/usr/bin/env node

"use strict";

const chalk = require("chalk");

const process = require("process");
const { program } = require('commander');
const { creatReact } = require("./creatReact.js");

const packageJson = require("../package.json");

function initProgram() {
    // 命令辅助信息
    program
        .version(packageJson.version, "-v, --vers", "output the current version")
        .description("Initialize a ts project based on create-next-app")
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

    // 接收--info参数， 返回环境信息
    if (options.info) {
        console.log(chalk.bold("\nEnvironment Info:"));
        console.log(`\n  current version of ${packageJson.name}: ${packageJson.version}`);
        console.log(`  running from ${__dirname}`);
        envinfo
            .run(
                {
                    System: ["OS", "CPU"],
                    Binaries: ["Node", "npm", "Yarn"],
                    Browsers: ["Chrome", "Edge", "Internet Explorer", "Firefox", "Safari"],
                    npmPackages: ["react", "react-dom", "react-scripts"],
                },
                {
                    duplicates: true,
                    showNotFound: true,
                }
            )
            .then(console.log);
    }
}


module.exports = {
    initProgram,
}