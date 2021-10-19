'use strict';

const chalk = require("chalk");
const { spawn, spawnSync, execSync } = require('child_process');
const path = require("path");
const os = require("os");
var process = require("process");
const { Command } = require("commander");
const inquirer = require("inquirer");
const fs = require("fs-extra");
const validateProjectName = require("validate-npm-package-name");

const packageJson = require("../package.json");

let projectName;

// 命令辅助信息
const program = new Command(packageJson.name)
  .version(packageJson.version)
  .arguments("<project-dir>")
  .usage(`${chalk.green("<project-directory>")} [options]`)
  .action(function (name) {
    projectName = name;
  })
  .option("--use-multipage")
  .option("--info", "print environment debug info")
  .option("--help", () => {
    console.log(`Only ${chalk.green("<project-directory>")} is required.`);
  })
  .parse(process.argv);

// 接收--info参数， 返回环境信息
if (program.info) {
  console.log(chalk.bold("\nEnvironment Info:"));
  console.log(
    `\n  current version of ${packageJson.name}: ${packageJson.version}`
  );
  console.log(`  running from ${__dirname}`);
  envinfo
  .run(
      {
        System: ["OS", "CPU"],
        Binaries: ["Node", "npm", "Yarn"],
        Browsers: ["Chrome", "Edge", "Internet Explorer", "Firefox", "Safari"],
        npmPackages: ["react", "react-dom", "react-scripts"],
        npmGlobalPackages: ["create-react-app"],
      },
      {
        duplicates: true,
        showNotFound: true,
      }
    )
    .then(console.log);
}
// 判断项目名是否存在
if (!projectName) {
  console.error("Please specify the project directory:");
  console.log(
    `  ${chalk.cyan(program.name())} ${chalk.green("<project-directory>")}`
  );
  console.log("For example:");
  console.log(
    `  ${chalk.cyan(program.name())} ${chalk.green("my-react-demo")}`
  );
  console.log();
  console.log(
    `Run ${chalk.cyan(`${program.name()} --help`)} to see all options.`
  );
  process.exit(1);
}

// creatReact
function creatReact(name, useMultipage) {
  const root = path.resolve(name);
  const appName = path.basename(root);
  // 检查项目名是否合法
  checkAppName(name);

  // 检查目标文件名是否存在， 不存在的话创建文件
  const bool = fs.pathExistsSync(appName);
  if (bool) {
    console.error(
      chalk.red(
        "\nThe project name already exists, please reset the project name"
      )
    );
    // process.exit(1);
  }
  // 创建目标项目

  try {
    install(root, useMultipage);
  } catch (error) {
    console.log(error);
  }
}

// install
async function install(root, useMultipage) {
  const rootpath = path.dirname(root);
  const name = path.basename(root);
  let args = ["create-react-app", name, "--template", "typescript"];
  const resultInit = spawnSync("npx", args);

  process.chdir(root);

  process.cwd();

  const installOther = ["antd", "axios", "typestyle"].sort();

  const argsd = ["add"].concat(installOther);
  await spawn("yarn", argsd);

  const installDevOther = [
    "babel-plugin-import",
    "cross-env",
    "file-loader",
    "craco-less",
    "@craco/craco",
    "stylelint",
    "stylelint-order",
    "stylelint-config-standard",
    "stylelint-config-prettier",
    "husky",
    "lint-staged",
    "commitizen",
    "cz-conventional-changelog",
    "@commitlint/config-conventional",
    "@commitlint/cli",
    "standard-version",
  ];
  const argsdevd = ["add", "--dev"].concat(installDevOther);

  await spawn("yarn", argsdevd);

  execSync(
    `echo "module.exports = {extends: ['@commitlint/config-conventional']}" > commitlint.config.js`
  );

  await fs.copy(path.join(rootpath, "/src/react-typescript-template"), root);

  const currentPackageJson = await fs.readJson(root + "/package.json", {
    throws: false,
  });

  currentPackageJson["script"] = {
    start: "cross-env craco start",
    build: "cross-env craco build",
    test: "craco test",
    "build:analyze": "cross-env analyze=true craco build",
    commit: "npx git-cz",
    release: "standard-version",
    prepare: "husky install",
    eslint: "./node_modules/.bin/eslint --fix --ext .tsx,.ts src/",
    stylelint: './node_modules/.bin/stylelint --fix .css,.less,.sass'
  };

  currentPackageJson["lint-staged"] = {
    "*.{ts,tsx,js,jsx}": ["npm run eslint", "git add ."],
    "*.{ts,tsx,json,css,less,md}": ["prettier --write --ignore-unknown", "git add ."],
  };

  fs.writeFileSync(
    path.join(root, "package.json"),
    JSON.stringify(currentPackageJson, null, 2)
  );
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
    [
      ...(validationResult.errors || []),
      ...(validationResult.warnings || []),
    ].forEach((error) => {
      console.error(chalk.red(`  * ${error}`));
    });
    console.error(chalk.red("\nPlease choose a different project name."));
    process.exit(1);
  }
}

creatReact(projectName, program.useMultipage);
