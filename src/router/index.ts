import {
    createRouter,
    createWebHistory,
    NavigationGuardNext,
    RouteLocationNormalized,
    Router,
} from "vue-router";
import { sessionStore } from "@/store/SessionStore";
import blogsRouter from "@/router/blogsRouter";
import userRouter from "@/router/userRouter";

const routes = [...userRouter, ...blogsRouter];

const router: Router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes: routes,
});

router.beforeEach(
    async (
        to: RouteLocationNormalized,
        from: RouteLocationNormalized,
        next: NavigationGuardNext,
    ): Promise<void> => {
        const pageTitle: string = String(to.meta.title);
        const sessStore = sessionStore();
        const isLoggedIn: boolean = sessStore.isLoggedIn;

        if (pageTitle) {
            document.title = pageTitle;
        }

        if (!to.meta?.restricted) {
            next();
            return;
        }

        if (to.meta?.restricted && isLoggedIn) {
            next();
            return;
        }

        if (to.meta?.restricted && !isLoggedIn) {
            next({ name: "Home" });
            return;
        } else {
            next();
            return;
        }
    },
);

export default router;
