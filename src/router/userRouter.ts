const userRouter = [
    {
        path: "/",
        children: [
            {
                path: "",
                name: "Home",
                component: () => import("@/views/Home.vue"),
                meta: {
                    title: "Home",
                    restricted: false,
                },
            },
            {
                path: "login",
                name: "Login",
                props: true,
                component: () => import("@/views/Login.vue"),
                meta: {
                    title: "Login",
                    restricted: false,
                },
            },
            {
                path: "register",
                name: "Register",
                props: true,
                component: () => import("@/views/Register.vue"),
                meta: {
                    title: "Register",
                    restricted: false,
                },
            },
        ],
    },
];

export default userRouter;
