import { defineConfig } from "umi";

import routes from "./config/routes";
import proxy from "./config/proxy";
import defaultSettings from "./config/defaultSettings";

const plugins = [];
if (process.env.NODE_ENV === "production") {
    plugins.push("transform-remove-console");
}

export default defineConfig({
    nodeModulesTransform: {
        type: "none",
    },
    extraBabelPlugins: plugins,
    routes,
    proxy,
    fastRefresh: {},
    hash: true,
    ...defaultSettings,
    tailwindcss: {
        tailwindCssFilePath: "/styles/tailwind.css",
        tailwindConfigFilePath: "tailwind.config.js", // Default value: tailwindConfigFilePath || join(process.env.APP_ROOT || api.cwd, 'tailwind.config.js'),
    },
    mfsu: {},
    webpack5: {},

    ignoreMomentLocale: true,
    workerLoader: {},
});
