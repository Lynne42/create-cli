#!/usr/bin/env node

"use strict";

const chalk = require("chalk");
const { spawn, spawnSync, execSync } = require("child_process");
const path = require("path");
const process = require("process");
const { fileURLToPath } = require("url");

const fs = require("fs-extra");
const validateProjectName = require("validate-npm-package-name");

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// install
async function install(root, useMultipage) {
    const rootpath = path.dirname(root);
    const name = path.basename(root);

    let args = ["create-umi@latest", name];
    spawnSync("npx", args, {
        stdio: "inherit",
    });

    // 选择基础模板

    process.chdir(root);
    process.cwd();

    const installOther = ["classnames"].sort();
    const argsd = ["install"].concat(installOther);
    spawnSync("npm", argsd, {
        stdio: "inherit",
    });

    const installDevOther = [
        "cross-env",
        "file-loader",
        "tailwindcss",
        "lint-staged",
        "commitizen",
        "cz-conventional-changelog",
        "@commitlint/config-conventional",
        "@commitlint/cli",
        "standard-version",
    ];
    const argsdevd = ["install", "--save-dev"].concat(installDevOther);
    spawnSync("npm", argsdevd, {
        stdio: "inherit",
    });

    spawnSync("npx", ["max", "g", "tailwindcss"], {
        stdio: "inherit",
    });

    execSync(
        `echo "module.exports = {extends: ['@commitlint/config-conventional']}" > commitlint.config.js`
    );

    await fs.copy(path.join(__dirname, "../template"), root);
    await fs.copy(path.join(__dirname, "../template-code"), root + "/src/");

    const currentPackageJson = fs.readJsonSync(root + "/package.json", {
        throws: false,
    });

    currentPackageJson["scripts"] = {
        ...currentPackageJson["scripts"],
        commit: "npx git-cz",
        release: "standard-version",
        eslint: "eslint --fix --ext .tsx,.ts src/",
    };

    currentPackageJson["lint-staged"] = {
        "*.{ts,tsx,js,jsx}": ["npm run eslint", "git add ."],
        "*.{ts,tsx,json,css,less,md}": ["npm run format", "git add ."],
    };
    currentPackageJson["config"] = {
        commitizen: {
            path: "cz-conventional-changelog",
        },
    };

    fs.writeFileSync(path.join(root, "package.json"), JSON.stringify(currentPackageJson, null, 2));
}

// 检查项目名是否合法
function checkAppName(appName) {
    const validationResult = validateProjectName(appName);
    if (!validationResult.validForNewPackages) {
        console.error(
            chalk.red(
                `Cannot create a project named ${chalk.green(
                    `"${appName}"`
                )} because of npm naming restrictions:\n`
            )
        );
        [...(validationResult.errors || []), ...(validationResult.warnings || [])].forEach(
            (error) => {
                console.error(chalk.red(`  * ${error}`));
            }
        );
        console.error(chalk.red("\nPlease choose a different project name."));
        process.exit(1);
    }
}

// creatReact
function creatReact(name, useMultipage) {
    const root = path.resolve(name);

    const appName = path.basename(root);

    // 检查项目名是否合法
    checkAppName(appName);

    // 检查目标文件名是否存在， 不存在的话创建文件
    const bool = fs.pathExistsSync(appName);

    if (bool) {
        console.error(
            chalk.red("\nThe project name already exists, please reset the project name")
        );
        process.exit(1);
    }
    // 创建目标项目
    try {
        fs.mkdir(root, (err) => {
            if (err) {
                return console.error(err);
            }

            install(root, useMultipage);
        });
    } catch (error) {
        console.log(error);
    }
}


module.exports = {
    creatReact,
}