const Home = () => import("@/views/Home.vue");
const Login = () => import("@/views/Login.vue");
const Register = () => import("@/views/Register.vue");

const userRouter = [
    {
        path: "/",
        children: [
            {
                path: "",
                name: "Home",
                component: Home,
                meta: {
                    title: "Home",
                    restricted: false,
                },
            },
            {
                path: "login",
                name: "Login",
                props: true,
                component: Login,
                meta: {
                    title: "Login",
                    restricted: false,
                },
            },
            {
                path: "register",
                name: "Register",
                props: true,
                component: Register,
                meta: {
                    title: "Register",
                    restricted: false,
                },
            },
        ],
    },
];

export default userRouter;
