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
                props: true,
                component: () => import("@/views/Register.vue"),
                meta: {
                    title: "Register",
                    restricted: false,
                },
            },

        ],
    },
    {
        path: "/blogs",
        name: "Blogs",
        component: () => import("@/views/Blogs.vue"),
        children: [
            {
                path: "create",
                name: "BlogCreator",
                component: () => import("@/views/BlogCreator.vue")
            },
            {
                path: ":id",
                name: "Blog",
                props: true,
                component: () => import("@/views/Blog.vue"),
                meta: {
                    restricted: true,
                    title: "Blog Post Title"
                }
            }
        ],
        meta: {
            restricted: true,
            title: "Blogs"
        }
    }
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
