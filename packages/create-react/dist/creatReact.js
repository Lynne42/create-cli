#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: !0 }), (exports.default = creatReact);
var _chalk = _interopRequireDefault(require("chalk")),
    _child_process = require("child_process"),
    _path = _interopRequireDefault(require("path")),
    _process = _interopRequireDefault(require("process")),
    _url = require("url"),
    _fsExtra = _interopRequireDefault(require("fs-extra")),
    _validateNpmPackageName = _interopRequireDefault(require("validate-npm-package-name"));
function _interopRequireDefault(a) {
    return a && a.__esModule ? a : { default: a };
}
const _filename = (0, _url.fileURLToPath)(import.meta.url),
    _dirname = _path.default.dirname(_filename); // install
async function install(a) {
    const b = _path.default.dirname(a),
        c = _path.default.basename(a);
    (0, _child_process.spawnSync)(
        "npx",
        ["create-react-app@latest", c, "--template", "typescript"],
        { stdio: "inherit" }
    ),
        _process.default.chdir(a),
        _process.default.cwd();
    const d = ["antd", "axios", "classnames"].sort(),
        e = ["add"].concat(d);
    (0, _child_process.spawnSync)("yarn", e, { stdio: "inherit" });
    const f = ["add", "--dev"].concat([
        "cross-env",
        "file-loader",
        "craco-less",
        "@craco/craco",
        "tailwindcss",
        "postcss",
        "autoprefixer",
        "eslint-config-prettier",
        "eslint-plugin-prettier",
        "stylelint",
        "stylelint-order",
        "stylelint-config-standard",
        "stylelint-config-prettier",
        "@typescript-eslint/eslint-plugin",
        "@typescript-eslint/parser",
        "prettier",
        "husky",
        "lint-staged",
        "commitizen",
        "cz-conventional-changelog",
        "@commitlint/config-conventional",
        "@commitlint/cli",
        "standard-version",
    ]);
    (0, _child_process.spawnSync)("yarn", f, { stdio: "inherit" }),
        (0, _child_process.spawnSync)("npx", ["tailwindcss", "init", "-p"], { stdio: "inherit" }),
        (0, _child_process.execSync)(
            `echo "module.exports = {extends: ['@commitlint/config-conventional']}" > commitlint.config.js`
        ),
        await _fsExtra.default.copy(_path.default.join(_dirname, "../template"), a),
        await _fsExtra.default.copy(_path.default.join(_dirname, "../template-code"), a + "/src/");
    const g = _fsExtra.default.readJsonSync(a + "/package.json", { throws: !1 });
    (g.scripts = {
        start: "cross-env craco start",
        build: "cross-env craco build",
        test: "craco test",
        "build:analyze": "cross-env analyze=true craco build",
        commit: "npx git-cz",
        release: "standard-version",
        prepare: "husky install",
        eslint: "./node_modules/.bin/eslint --fix --ext .tsx,.ts src/",
        stylelint: "./node_modules/.bin/stylelint --fix .css,.less,.sass",
    }),
        (g["lint-staged"] = {
            "*.{ts,tsx,js,jsx}": ["npm run eslint", "git add ."],
            "*.{ts,tsx,json,css,less,md}": ["prettier --write --ignore-unknown", "git add ."],
        }),
        (g.config = { commitizen: { path: "cz-conventional-changelog" } }),
        _fsExtra.default.writeFileSync(
            _path.default.join(a, "package.json"),
            JSON.stringify(g, null, 2)
        );
} // 检查项目名是否合法
function checkAppName(a) {
    const b = (0, _validateNpmPackageName.default)(a);
    b.validForNewPackages ||
        (console.error(
            _chalk.default.red(
                `Cannot create a project named ${_chalk.default.green(
                    `"${a}"`
                )} because of npm naming restrictions:\n`
            )
        ),
        [...(b.errors || []), ...(b.warnings || [])].forEach((a) => {
            console.error(_chalk.default.red(`  * ${a}`));
        }),
        console.error(_chalk.default.red("\nPlease choose a different project name.")),
        _process.default.exit(1));
} // creatReact
function creatReact(a, b) {
    const c = _path.default.resolve(a),
        d = _path.default.basename(c);
    checkAppName(d); // 检查目标文件名是否存在， 不存在的话创建文件
    const e = _fsExtra.default.pathExistsSync(d);
    e &&
        (console.error(
            _chalk.default.red("\nThe project name already exists, please reset the project name")
        ),
        _process.default.exit(1)); // 创建目标项目
    try {
        _fsExtra.default.mkdir(c, (a) => (a ? console.error(a) : void install(c, b)));
    } catch (a) {
        console.log(a);
    }
}
