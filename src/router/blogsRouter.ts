const BlogsView = () => import("@/views/blogs/BlogsView.vue");
const BlogPosts = () => import("@/views/blogs/BlogPosts.vue");
const BlogCreator = () => import("@/views/blogs/BlogCreator.vue");
const BlogUpdater = () => import("@/views/blogs/BlogUpdater.vue");
const BlogViewer = () => import("@/views/blogs/BlogViewer.vue");
const BlogFeed = () => import("@/views/blogs/BlogFeed.vue");

const blogsRouter = [
    {
        path: "/blogs",
        component: BlogsView,
        props: true,
        children: [
            {
                path: "",
                name: "BlogPosts",
                component: BlogPosts,
                meta: {
                    restricted: true,
                    meta: "Blog Posts",
                },
            },
            {
                path: "create",
                name: "BlogCreator",
                component: BlogCreator,
                meta: {
                    restricted: true,
                    title: "Blog Creator",
                },
            },
            {
                path: "update/:blogId/:readonly",
                name: "BlogUpdater",
                props: true,
                component: BlogUpdater,
                meta: {
                    restricted: true,
                    title: "Blog Updater",
                },
            },
            {
                path: "/view/:blogId/:readonly",
                name: "BlogViewer",
                props: true,
                component: BlogViewer,
                meta: {
                    restricted: false,
                    title: "Blog Post Title",
                },
            },
            {
                path: "/feed",
                name: "BlogFeed",
                component: BlogFeed,
                meta: {
                    restricted: true,
                    title: "Your Feed",
                },
            },
        ],
        meta: {
            restricted: true,
            title: "Blogs",
        },
    },
];

export default blogsRouter;
