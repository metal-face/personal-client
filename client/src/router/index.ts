// Composables
import { createRouter, createWebHistory, Router } from "vue-router";

const routes = [
    {
        path: "/",
        children: [
            {
                path: "",
                component: () => import("@/views/Home.vue"),
                meta: {
                    title: "Home",
                    restricted: false,
                },
            },
            {
                path: "login",
                component: () => import("@/views/Login.vue"),
                meta: {
                    title: "Login",
                    restricted: false,
                },
            },
            {
                path: "signup",
                component: () => import("@/views/Signup.vue"),
                meta: {
                    title: "Signup",
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

export default router;
