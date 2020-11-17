/*
 * @Description: 
 * @Author: qiaolingniu
 * @Date: 2020-08-20 11:39:47
 * @LastEditors: qiaolingniu
 * @LastEditTime: 2020-08-20 11:42:15
 * @FilePath: /create-cli/tasks/cr.js
 */
const fs = require('fs');
const path = require('path');
const cp = require('child_process');

const rootDir = path.join(__dirname, '..');
const packagesDir = path.join(rootDir, 'packages');

const args = process.argv.slice(2);

const craScriptPath = path.join(packagesDir, 'create-react-app', 'index.js');
cp.execSync(
  `node ${craScriptPath} ${args.join(' ')}`,
  {
    cwd: rootDir,
    stdio: 'inherit',
  }
);