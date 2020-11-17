/*
 * @Description:
 * @Author: qiaolingniu
 * @Date: 2020-07-12 09:46:20
 * @LastEditors: qiaolingniu
 * @LastEditTime: 2020-07-22 15:10:17
 * @FilePath: /aap-audit-workbench/config/entry.js
 */

const path = require('path');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');


const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

// 获取多入口文件地址
function getAllSitePath(source) {
  const { lstatSync, readdirSync } = fs;
  const { join } = path;
  const result = {};
  const isDirectory = source => lstatSync(source).isDirectory();
  readdirSync(source).map((name) => {
    const path = join(resolveApp(source), name);
    if (isDirectory(path)) {
      result[name] = path;
    }
  });
  return result;
}

// 入口文件名地址
const fileSites = getAllSitePath('src/sites');

// 入口文件名
const fileNames = Object.keys(fileSites);

// devserver entry config
const rewrites = fileNames.map(item => ({
  from: new RegExp(`^\\/${item}/`, 'i'),
  to: `/${item}/index.html`,
}));

// every page HtmlWebpackPlugin
const getEveryPageHtml = () => fileNames.map(item => (
  new HtmlWebpackPlugin({
    inject: true,
    chunks: [item],
    template: `${fileSites[item]}/index.html`,
    filename: `${item}/index.html`,
  })
));

// webpack entry config
const getEntryList = (isDev, currentfile) => {
  const entry = {};
  const fileNameList = currentfile ? [currentfile] : fileNames;

  fileNameList.forEach((name) => {
    entry[name] = [
      isDev && require.resolve('react-dev-utils/webpackHotDevClient'),
      isDev && require.resolve('react-error-overlay'),
      `./src/sites/${name}/index.js`,
    ].filter(Boolean);
  });
  return entry;
};

// 移除原有的ManifestPlugin
const removeManifest = (config, pluginName) => {
  config.plugins = config.plugins.filter(p => p.constructor.name !== pluginName);
  return config;
};

// 消除MiniCssExtractPlugin顺序警告
const delMiniCssExtractPluginConflictingOrder = (config, options) => {
  const plugins = config.plugins;
  const len = plugins.length;
  for (let i = 0; i < len; i++) {
    const p = plugins[i];
    if (!!p.constructor && p.constructor.name === MiniCssExtractPlugin.name) {
      const miniCssExtractOptions = { ...p.options, ...options, ignoreOrder: true };
      plugins[i] = new MiniCssExtractPlugin(miniCssExtractOptions);
      break;
    }
  }
};

module.exports = {
  fileSites,
  fileNames,
  devserverRewrites: rewrites,
  getEveryPageHtml,
  getEntryList,
  removeManifest,
  delMiniCssExtractPluginConflictingOrder,
};
