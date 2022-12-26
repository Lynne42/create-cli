#!/usr/bin/env node

const { buildSync } = require("esbuild");
const path = require("path");
const fs = require("fs");
const packages = fs.readdirSync(path.join(__dirname, "packages"));

const createBuildConfig = (targetPath) => {
    const config = {
        platform: "node",
        entryPoints: [path.join(targetPath, "src/index.js")],
        outfile: path.join(targetPath, "dist/index.js"),
        bundle: true,
        minify: true,
        target: "es2015",
        format: "cjs",
        allowOverwrite: true,
    };
    return config;
};

packages.forEach((package) => {
    console.log(package);
    if (![".DS_Store"].includes(package)) {
        const targetPath = path.join(__dirname, "packages", package);
        const config = createBuildConfig(targetPath);
        buildSync(config);
    }
});
