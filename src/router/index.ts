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

        console.log(isAuthenticated);

        if (pageTitle) {
            document.title = pageTitle;
        }

        if (to.name !== "Login" && !isAuthenticated) next({ name: "Login" });
        else next();
    },
);

export default router;
