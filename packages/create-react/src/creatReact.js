#!/usr/bin/env node

"use strict";

import chalk from "chalk";
import { spawn, spawnSync, execSync } from "child_process";
import path from "path";
import process from "process";
import { fileURLToPath } from "url";

import fs from "fs-extra";
import validateProjectName from "validate-npm-package-name";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// install
async function install(root, useMultipage) {
    const rootpath = path.dirname(root);
    const name = path.basename(root);

    let args = ["create-react-app@latest", name, "--template", "typescript"];
    spawnSync("npx", args, {
        stdio: "inherit",
    });

    process.chdir(root);
    process.cwd();

    const installOther = ["antd", "axios", "classnames"].sort();
    const argsd = ["add"].concat(installOther);
    spawnSync("yarn", argsd, {
        stdio: "inherit",
    });

    const installDevOther = [
        "cross-env",
        "file-loader",
        "craco-less",
        "@craco/craco",
        "tailwindcss",
        "postcss",
        "autoprefixer",
        "eslint-config-prettier",
        "eslint-plugin-prettier",
        "stylelint",
        "stylelint-order",
        "stylelint-config-standard",
        "stylelint-config-prettier",
        "@typescript-eslint/eslint-plugin",
        "@typescript-eslint/parser",
        "prettier",
        "husky",
        "lint-staged",
        "commitizen",
        "cz-conventional-changelog",
        "@commitlint/config-conventional",
        "@commitlint/cli",
        "standard-version",
    ];
    const argsdevd = ["add", "--dev"].concat(installDevOther);
    spawnSync("yarn", argsdevd, {
        stdio: "inherit",
    });

    spawnSync("npx", ["tailwindcss", "init", "-p"], {
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
        start: "cross-env craco start",
        build: "cross-env craco build",
        test: "craco test",
        "build:analyze": "cross-env analyze=true craco build",
        commit: "npx git-cz",
        release: "standard-version",
        prepare: "husky install",
        eslint: "./node_modules/.bin/eslint --fix --ext .tsx,.ts src/",
        stylelint: "./node_modules/.bin/stylelint --fix .css,.less,.sass",
    };

    currentPackageJson["lint-staged"] = {
        "*.{ts,tsx,js,jsx}": ["npm run eslint", "git add ."],
        "*.{ts,tsx,json,css,less,md}": ["prettier --write --ignore-unknown", "git add ."],
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
export default function creatReact(name, useMultipage) {
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
