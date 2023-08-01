import ApiClient from "@/clients/ApiClient";
import { AxiosResponse } from "axios";

export default {
    createBlogPost(
        blogTitle: string,
        blogPost: string,
        accountId: string,
    ): Promise<AxiosResponse<any, any>> {
        return ApiClient({
            method: "POST",
            url: "/blog",
            data: {
                blog_post: blogPost,
                blog_title: blogTitle,
                account_id: accountId,
            },
        });
    },
    fetchManyBlogs(accountId: string): Promise<AxiosResponse<any, any>> {
        return ApiClient({
            method: "GET",
            url: `/blogs?account_id=${accountId}`,
        });
    },
    fetchBlogById(blogId: string): Promise<AxiosResponse<any, any>> {
        return ApiClient({
            method: "GET",
            url: `/blogs/${blogId}`,
        });
    },
    updateBlogById(
        blogId: string,
        accountId: string,
        blogTitle?: string,
        blogPost?: string,
    ): Promise<AxiosResponse<any, any>> {
        return ApiClient({
            method: "PATCH",
            url: `/blogs/${blogId}`,
            data: {
                blog_title: blogTitle,
                blog_post: blogPost,
                account_id: accountId,
            },
        });
    },
    deleteBlogById(blogId: string): Promise<AxiosResponse<any, any>> {
        return ApiClient({
            method: "DELETE",
            url: `/blogs/${blogId}`,
        });
    },
};
