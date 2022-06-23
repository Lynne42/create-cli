export default {
    "/mock1/sharestore/resource": {
        target: "http://yapi.realai-inc.cn",
        changeOrigin: true,
        pathRewrite: { "/mock1/sharestore/resource": "/mock/155" },
    },

    "/mock": {
        target: "http://yapi.realai-inc.cn/mock/155/api",
        changeOrigin: true,
        pathRewrite: { "/mock": "" },
    },

    "/api/sharestore/resource/": {
        target: "http://XXX",
        changeOrigin: true,
    },

    "/api": {
        target: "http://XXX",
        changeOrigin: true,
    },
};
