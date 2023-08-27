import { createRouter, createWebHistory, Router } from "vue-router";
import { sessionStore } from "@/store/SessionStore";
import blogsRouter from "@/router/blogsRouter";
import userRouter from "@/router/userRouter";

const routes = [...userRouter, ...blogsRouter];

const router: Router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
});

router.beforeEach((to, from, next) => {
    const pageTitle: string = String(to.meta.title);
    const sessStore = sessionStore();

    if (pageTitle) {
        document.title = pageTitle;
    }

    next();
});

export default router;
