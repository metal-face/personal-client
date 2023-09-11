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
    routes,
});

router.beforeEach(
    async (
        to: RouteLocationNormalized,
        from: RouteLocationNormalized,
        next: NavigationGuardNext,
    ): Promise<void> => {
        const pageTitle: string = String(to.meta.title);
        const sessStore = sessionStore();
        const isAuthenticated: boolean = await sessStore.isAuthenticated;

        if (pageTitle) {
            document.title = pageTitle;
        }

        if (!to.meta?.restricted) {
            next();
            return;
        }

        if (to.meta?.restricted && isAuthenticated) {
            next();
            return;
        }

        console.log("here 3");
        if (to.meta.restricted && !isAuthenticated) {
            next({ name: "Home" });
            return;
        } else {
            next();
            return;
        }
    },
);

export default router;
