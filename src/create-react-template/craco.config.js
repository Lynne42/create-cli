/*
 * @Description:
 * @Author: qiaolingniu
 * @Date: 2020-07-12 07:09:16
 * @LastEditors: qiaolingniu
 * @LastEditTime: 2020-08-19 15:27:41
 * @FilePath: /create-cli/src/create-react-template/craco.config.js
 */
const path = require('path');
const { when } = require('@craco/craco');
const CracoLessPlugin = require('craco-less');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
// const ResourcesWebpackPlugin = require("./config/resourcesWebpackPlugin");

const {
  devserverRewrites,
  getEveryPageHtml,
  getEntryList,
  removeManifest,
  delMiniCssExtractPluginConflictingOrder,
} = require('./config/multi');

const protocol = process.env.HTTPS === 'true' ? 'https' : 'http';
const app = process.env.APP || '';
const host = process.env.HOST || '0.0.0.0';
const openPage = process.env.file;
const analyze = process.env.analyze === 'true';

const cssMiniConfig = isDev => ({
  filename: isDev ? '[name]/[name].css' : '[name]/[name].[contenthash:5].css',
  chunkFilename: isDev ? '[name]/[name].css' : '[name]/[name].[contenthash:5].css',
});

module.exports = ({ env }) => {
  const isDev = env === 'development';
  const isProd = env === 'production';

  return {
    webpack: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
      plugins: [
        ...(when(analyze, () => [new BundleAnalyzerPlugin()], [])),
        ...getEveryPageHtml(),
        // new ResourcesWebpackPlugin(),
      ],
      configure: (webpackConfig) => {
        // 移除原有的ManifestPlugin
        let config = removeManifest(webpackConfig, 'ManifestPlugin');

        config = {
          ...webpackConfig,
          entry: isDev ? getEntryList(isDev, openPage) : getEntryList(isDev),
          output: {
            ...(webpackConfig.output),
            path: path.resolve(__dirname, 'build'),
            filename: isDev ? '[name]/[name].js' : '[name]/[name].[chunkhash:5].js',
            chunkFilename: isDev ? '[name]/[name].js' : '[name]/[name].[chunkhash:5].js',
          },
          externals: {
            ...(config.externals || {}),
            jquery: 'jQuery',
          },
          optimization: {
            ...(webpackConfig.optimization),
            splitChunks: {
              minChunks: 1,
              maxAsyncRequests: 5,
              maxInitialRequests: 3,
              chunks: 'all',
              name: false,
              cacheGroups: {
                bizchart: {
                  name: false,
                  test: /(@antv\/data-set|bizcharts)/,
                  chunks: 'all',
                  priority: 10,
                  minChunks: 2,
                },
              },
            },
          },
        };
        if (isProd) {
          config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true;
        }
        delMiniCssExtractPluginConflictingOrder(config, cssMiniConfig(isDev));
        return config;
      },
    },
    devServer: (devServerConfig, { proxy }) => ({
      ...devServerConfig,
      openPage: `/${openPage}`,
      host,
      https: protocol === 'https',
      historyApiFallback: {
        disableDotRule: true,
        // 多入口
        rewrites: devserverRewrites,
      },
      proxy: {
        ...proxy,
        '/**': {
          target: 'http://localhost:3000',
          changeOrigin: true,
          secure: false,
          headers: {
            Connection: 'keep-alive',
          },
        },
      },
    }),
    plugins: [
      {
        plugin: CracoLessPlugin,
        options: {
          lessLoaderOptions: {
            lessOptions: {
              modifyVars: { '@primary-color': '#32a982' },
              javascriptEnabled: true,
            },
          },
        },
      },
    ],
    babel: {
      presets: [],
      plugins: [
        [
          'import',
          { libraryName: 'antd', libraryDirectory: 'lib', style: true },
        ],
      ],
      loaderOptions: babelLoaderOptions => babelLoaderOptions,
    },
  };
};
