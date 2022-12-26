export default {

    "/mock": {
        target: "http://xx",
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
