import ApiClient from "@/clients/ApiClient";
import { AxiosResponse } from "axios";

export default {
    createBlogPost(
        blogTitle: string,
        blogPost: string,
        accountId: string,
        sessionId: string,
    ): Promise<AxiosResponse<any, any>> {
        return ApiClient({
            method: "POST",
            url: "/blogs",
            data: {
                blog_post: blogPost,
                blog_title: blogTitle,
                account_id: accountId,
            },
            headers: {
                Authorization: `Bearer ${sessionId}`,
            },
        });
    },
    fetchManyBlogs(accountId?: string): Promise<AxiosResponse<any, any>> {
        if (accountId) {
            return ApiClient({
                method: "GET",
                url: `/blogs?account_id=${accountId}`,
            });
        }
        return ApiClient({
            method: "GET",
            url: "/blogs",
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
        sessionId: string,
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
            headers: {
                Authorization: `Bearer ${sessionId}`,
            },
        });
    },
    deleteBlogById(blogId: string, sessionId: string): Promise<AxiosResponse<any, any>> {
        return ApiClient({
            method: "DELETE",
            url: `/blogs/${blogId}`,
            headers: {
                Authorization: `Bearer ${sessionId}`,
            },
        });
    },
};
