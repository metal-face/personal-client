import { createRouter, createWebHistory, Router } from "vue-router";

const routes = [
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
                component: () => import("@/views/Register.vue"),
                meta: {
                    title: "Register",
                    restricted: false,
                },
            },
        ],
    },
];

const router: Router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
});

router.beforeEach((to, from, next) => {
    const pageTitle: string = String(to.meta.title);
    
    if (pageTitle) {
        document.title = pageTitle;
    }

    next();
});

export default router;
