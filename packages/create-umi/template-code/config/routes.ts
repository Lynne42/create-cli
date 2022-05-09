export default [
    {
        path: "/",
        component: "@/pages/index.tsx",
        routes: [
            {
                path: "/login",
                component: "@/pages/Login",
            },
            {
                path: "/connect",
                component: "@/pages/connect/index.tsx",
            },
            {
                path: "/",
                component: "@/components/layouts/index.tsx",

                routes: [
                    { path: "/", redirect: "/home" },
                    {
                        path: "/home",
                        component: "@/pages/home/index.tsx",
                        name: "主页",
                    },
                ],
            },
            {
                component: "@/components/screenLoading/index",
            },
        ],
    },
];
