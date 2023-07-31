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
        component: () => import("@/views/blogs/BlogsView.vue"),
        meta: {
            restricted: true,
            title: "Blogs",
        },
        children: [
            {
                path: "",
                name: "UserBlogPosts",
                component: () => import("@/views/blogs/UserBlogPosts.vue"),
                meta: {
                    restricted: true,
                    meta: "Blog Posts"
                }
            },
            {
                path: "create",
                name: "BlogCreator",
                component: () => import("@/views/blogs/BlogCreator.vue")
            },
            {
                path: ":id",
                name: "Blog",
                props: true,
                component: () => import("@/views/blogs/Blog.vue"),
                meta: {
                    restricted: true,
                    title: "Blog Post Title"
                }
            }
        ],

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
