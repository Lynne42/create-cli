#!/usr/bin/env node

const { initProgram } = require("./initProgram.js");

const init = () => {
    var currentNodeVersion = process.versions.node;
    var semver = currentNodeVersion.split(".");
    var major = semver[0];

    if (major < 14) {
        console.error(
            "You are running Node " +
                currentNodeVersion +
                ".\n" +
                "Create React App requires Node 14 or higher. \n" +
                "Please update your version of Node."
        );
        process.exit(1);
    }
    initProgram();
};

init()