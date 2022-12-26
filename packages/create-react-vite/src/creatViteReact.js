#!/usr/bin/env node

"use strict";

const chalk = require("chalk");
const { spawn, spawnSync, execSync } = require("child_process");
const path = require("path");
const process = require("process");

const fs = require("fs-extra");
const validateProjectName = require("validate-npm-package-name");

const { addTsConfigPathAlias } = require("./utils/addPathAlias");

// const { fileURLToPath } = require("url");
// const dirname = path.dirname(fileURLToPath(import.meta.url));

// install
async function install(root, useMultipage) {
    const rootpath = path.dirname(root);
    const name = path.basename(root);

    let args = ["create", "vite", name, "--template", "react-ts"];
    spawnSync("yarn", args, {
        stdio: "inherit",
    });

    // ts配置文件添加路径别名配置
    addTsConfigPathAlias(path.join(root, "tsconfig.json"));

    process.chdir(root);
    process.cwd();

    spawnSync("yarn", {
        stdio: "inherit",
    });

    const installOther = ["antd", "axios", "classnames", "lodash"].sort();
    const argsd = ["add"].concat(installOther);
    spawnSync("yarn", argsd, {
        stdio: "inherit",
    });

    const installDevOther = [
        "cross-env",
        "tailwindcss",
        "postcss",
        "autoprefixer",
        "eslint",
        "eslint-config-prettier",
        "eslint-plugin-prettier",
        "eslint-plugin-import",
        "eslint-plugin-jsx-a11y",
        "eslint-plugin-react",
        "eslint-plugin-simple-import-sort",
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
        "@types/lodash",
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
        ...currentPackageJson["scripts"],
        commit: "npx git-cz",
        release: "standard-version",
        prepare: "husky install",
        eslint: "./node_modules/.bin/eslint --fix --ext .tsx,.ts src/",
        stylelint: "./node_modules/.bin/stylelint --fix .css,.less,.sass",
        "lint:format": 'prettier  --loglevel warn --write "./**/*.{js,jsx,ts,tsx,css,md,json}" ',
        lint: "yarn lint:format && yarn lint:fix ",
    };

    currentPackageJson["lint-staged"] = {
        "*.{ts,tsx,js,jsx}": ["npm run lint", "git add ."],
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
};
