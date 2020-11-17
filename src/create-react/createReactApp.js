/*
 * @Description: 
 * @Author: qiaolingniu
 * @Date: 2020-08-17 17:32:42
 * @LastEditors: qiaolingniu
 * @LastEditTime: 2020-08-20 11:20:42
 * @FilePath: /create-cli/src/create-react/createReactApp.js
 */
const chalk = require('chalk');
const path = require('path');
const os = require('os');
var process = require('process');
const execSync = require('child_process').execSync;
const { Command } = require('commander');
const inquirer = require('inquirer');
const spawn = require('cross-spawn');
const fs = require('fs-extra');
const validateProjectName = require('validate-npm-package-name');

const packageJson = require('./package.json');

let projectName;

// 命令辅助信息
const program = new Command(packageJson.name)
  .version(packageJson.version)
  .arguments('<project-dir>')
  .usage(`${chalk.green('<project-directory>')} [options]`)
  .action(function (name) {
    projectName = name;
  })
  .option('--use-multipage')
  .option('--info', 'print environment debug info')
  .option('--help', () => {
    console.log(`Only ${chalk.green('<project-directory>')} is required.`);
  })
  .parse(process.argv)

// 接收--info参数， 返回环境信息
if (program.info) {
  console.log(chalk.bold('\nEnvironment Info:'));
  console.log(
    `\n  current version of ${packageJson.name}: ${packageJson.version}`
  );
  console.log(`  running from ${__dirname}`);
  return envinfo
    .run(
      {
        System: ['OS', 'CPU'],
        Binaries: ['Node', 'npm', 'Yarn'],
        Browsers: ['Chrome', 'Edge', 'Internet Explorer', 'Firefox', 'Safari'],
        npmPackages: ['react', 'react-dom', 'react-scripts'],
        npmGlobalPackages: ['create-react-app'],
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
  console.error('Please specify the project directory:');
  console.log(
    `  ${chalk.cyan(program.name())} ${chalk.green('<project-directory>')}`
  );
  console.log('For example:');
  console.log(`  ${chalk.cyan(program.name())} ${chalk.green('my-react-demo')}`);
  console.log();
  console.log(
    `Run ${chalk.cyan(`${program.name()} --help`)} to see all options.`
  );
  process.exit(1);
}
console.log(1, projectName)
creatReact(projectName, program.useMultipage,);
// creatReact
function creatReact(name, useMultipage) {
  const root = path.resolve(name);
  const appName = path.basename(root);
  console.log(2, root, appName)
  // 检查项目名是否合法
  checkAppName(name);

  // 检查目标文件名是否存在， 不存在的话创建文件
  const bool = fs.pathExistsSync(appName);
  if (bool) {
    console.error(chalk.red('\nThe project name already exists, please reset the project name'));
    // process.exit(1);
  }
  // 创建目标项目

  try {
    install(root, useMultipage)
  } catch (error) {
    console.log(error)
  }
}

// install
async function install(root, useMultipage) {
  const rootpath = path.dirname(root);
  const name = path.basename(root);
  let args = [
    'create-react-app',
    name,
    '--use-npm'
  ];
  const resultInit = spawn.sync('npx', args, { stdio: 'inherit' });
  

  process.chdir(root);

  process.cwd()

  const installOther = [
    'antd', '@craco/craco', 'axios', 'craco-less', '@tencent/eslint-config-tencent',
    'prop-types', 'styled-components'].sort();

  const argsd = [
    'install',
    '--save'
  ].concat(installOther)
  await spawn('npm', argsd, { stdio: 'inherit' });

  const installDevOther = [
    'babel-plugin-import',
    'cross-env',
    'file-loader',
    'webpack-bundle-analyzer',
    'commitizen',
    '@commitlint/config-conventional',
    '@commitlint/cli',
    'husky',
    'lint-staged',
    'standard-version'
  ];
  const argsdevd = [
    'install',
    '--save-dev'
  ].concat(installDevOther);

  await spawn('npm', argsdevd, { stdio: 'inherit' });

  await spawn('npx', ['commitizen', 'init', 'cz-conventional-changelog', '--save-dev', '--save-exact', '--force'], { stdio: 'inherit' });

  execSync(`echo "module.exports = {extends: ['@commitlint/config-conventional']}" > commitlint.config.js`);

  await fs.copy(path.join(rootpath, '/src/create-react-template'), root)

  const currentPackageJson = await fs.readJson(root + '/package.json', { throws: false })


  currentPackageJson['script'] = {
    "start": "cross-env pagetype=" + (useMultipage ? 'multipage' : 'singlepage') +" craco start",
    "build": "cross-env pagetype=" + (useMultipage ? 'multipage' : 'singlepage') +" craco build",
    "test": "craco test",
    "build:analyze": "cross-env analyze=true craco build",
    "commit": "npx git-cz",
    "release": "standard-version"
  }

  currentPackageJson.husky = {
    "hooks": {
      "pre-commit": "lint-staged",
      "prepare-commit-msg": "exec < /dev/tty && git cz --hook || true",
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
    }
  }
  currentPackageJson['lint-staged'] = {
    "*.js": [
      "./node_modules/.bin/eslint --fix",
      "git add ."
    ]
  }
  currentPackageJson['standard-version'] = {
    "skip": {
      "commit": true
    }
  }

  fs.writeFileSync(
    path.join(root, 'package.json'),
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
    ].forEach(error => {
      console.error(chalk.red(`  * ${error}`));
    });
    console.error(chalk.red('\nPlease choose a different project name.'));
    process.exit(1);
  }
}