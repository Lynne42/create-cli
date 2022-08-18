// 根目录新建 babel.config.js
module.exports = function (api) {
    api.cache(true);

    const presets = [
        [
            "@babel/env",
            {
                targets: {
                    "node": true
                },
            },
        ],
    ];

    if (!process.env["LOCAL_DEBUG"]) {
        presets.push(["minify"]);
    }

    const plugins = ["@babel/plugin-syntax-import-assertions", "babel-plugin-transform-import-meta"];

    return {
        presets,
        plugins,
        ignore: ["node_modules"],
    };
};
