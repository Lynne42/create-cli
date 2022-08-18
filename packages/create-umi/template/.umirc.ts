import { defineConfig } from "umi";

import routes from "./config/routes";
import proxy from "./config/proxy";
import defaultSettings from "./config/defaultSettings";

const plugins = [];
if (process.env.NODE_ENV === "production") {
  plugins.push("transform-remove-console");
}

export default defineConfig({
  extraBabelPlugins: plugins,
  routes,
  proxy,
  fastRefresh: true,
  hash: true,
  ...defaultSettings,
  extraPostCSSPlugins: [
    require("tailwindcss")({ config: "./tailwind.config.js" }),
    require("autoprefixer"),
  ],
  mfsu: {},
  ignoreMomentLocale: true,
});
