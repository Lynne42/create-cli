const CracoLessPlugin = require('craco-less');
const path = require('path');

const invade = (target, name, callback) => {
    target.forEach((item) => {
        if (item.constructor.name === name) {
            callback(item);
        }
    });
};

const dropConsole = () => {
    return (config) => {
        if (process.env.NODE_ENV === 'production') {
            invade(config.optimization.minimizer, 'TerserPlugin', (e) => {
                e.options.extractComments = false;
                e.options.terserOptions.compress.drop_console = true;
            });
        }
        return config;
    };
};

module.exports = {
    webpack: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
        },
        configure: (webpackConfig, {env, paths}) => {
            webpackConfig.module.rules.push({
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                use: [
                    {
                        loader: '@svgr/webpack',
                        options: {
                            babel: false,
                            icon: true,
                        },
                    },
                ],
            });

            webpackConfig = dropConsole()(webpackConfig);
            return webpackConfig;
        },
    },
    plugins: [
        {
            plugin: CracoLessPlugin,
            options: {
                lessLoaderOptions: {
                    lessOptions: {
                        modifyVars: {
                            '@body-background': '#222734',
                        },
                        javascriptEnabled: true,
                    },
                },
            },
        },
    ],
    devServer: (devServerConfig, {proxy}) => ({
        ...devServerConfig,
        proxy: {
            ...proxy,
            '/api': {
                target: 'http://yapi.realai-inc.cn',
                changeOrigin: true,
                secure: false,
                pathRewrite: {
                    '/api': '/mock/281/',
                },
            },
        },
    }),
};
