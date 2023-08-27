const blogsRouter = [
    {
        path: "/blogs",
        component: () => import("@/views/blogs/BlogsView.vue"),
        props: true,
        children: [
            {
                path: "",
                name: "UserBlogPosts",
                component: () => import("@/views/blogs/UserBlogPosts.vue"),
                meta: {
                    restricted: true,
                    meta: "Blog Posts",
                },
            },
            {
                path: "create/:readonly?/:blogId?",
                name: "BlogCreator",
                props: true,
                component: () => import("@/views/blogs/BlogCreator.vue"),
            },
            {
                path: ":id",
                name: "Blog",
                props: true,
                component: () => import("@/views/blogs/Blog.vue"),
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
