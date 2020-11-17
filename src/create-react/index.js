/*
 * @Description: 
 * @Author: qiaolingniu
 * @Date: 2020-08-17 17:30:59
 * @LastEditors: qiaolingniu
 * @LastEditTime: 2020-08-20 11:26:29
 * @FilePath: /create-cli/src/create-react/index.js
 */
'use strict';
require('./createReactApp');

const init = () => {
  var currentNodeVersion = process.versions.node;
  var semver = currentNodeVersion.split('.');
  var major = semver[0];

  if (major < 10) {
    console.error(
      'You are running Node ' +
      currentNodeVersion +
      '.\n' +
      'Create React App requires Node 10 or higher. \n' +
      'Please update your version of Node.'
    );
    process.exit(1);
  }
}
module.exports = init
