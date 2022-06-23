export default [
    {
        path: "/",
        component: "@/pages/index.tsx",
        routes: [
            {
                path: "/",

                routes: [
                    { path: "/", redirect: "/home" },
                    {
                        path: "/home",
                        component: "@/pages/index.tsx",
                        name: "主页",
                    },
                ],
            },
        ],
    },
];
