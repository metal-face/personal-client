const blogsRouter = [
    {
        path: "/blogs",
        component: () => import("@/views/blogs/BlogsView.vue"),
        props: true,
        children: [
            {
                path: "",
                name: "BlogPosts",
                component: () => import("@/views/blogs/BlogPosts.vue"),
                meta: {
                    restricted: true,
                    meta: "Blog Posts",
                },
            },
            {
                path: "create",
                name: "BlogCreator",
                component: () => import("@/views/blogs/BlogCreator.vue"),
                meta: {
                    restricted: true,
                    title: "Blog Creator",
                },
            },
            {
                path: "update/:blogId/:readonly",
                name: "BlogUpdater",
                props: true,
                component: () => import("@/views/blogs/BlogUpdater.vue"),
                meta: {
                    restricted: true,
                    title: "Blog Updater",
                },
            },
            {
                path: "/view/:blogId/:readonly",
                name: "BlogViewer",
                props: true,
                component: () => import("@/views/blogs/BlogViewer.vue"),
                meta: {
                    restricted: true,
                    title: "Blog Post Title",
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
