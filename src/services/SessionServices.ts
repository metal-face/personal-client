import ApiClient from "@/clients/ApiClient";
import { AxiosResponse } from "axios";

export default {
    login(username: string, password: string, token: string): Promise<AxiosResponse<any, any>> {
        return ApiClient({
            method: "POST",
            url: "/sessions",
            data: {
                username: username,
                password: password,
                token: token,
            },
        });
    },
    fetchManySessions(accountId?: string, user_agent?: string, page?: number, pageSize?: number) {
        return ApiClient({
            method: "GET",
            url: `/sessions?account_id=${accountId}&page=${page}&page_size=${pageSize}`,
            headers: {
                "User-Agent": user_agent,
            },
        });
    },
    fetchSessionById(session_id: string): Promise<AxiosResponse<any, any>> {
        return ApiClient({
            method: "GET",
            url: `/sessions/${session_id}`,
        });
    },
    logout(sessionId: string): Promise<AxiosResponse<any, any>> {
        return ApiClient({
            method: "DELETE",
            url: `/sessions`,
            headers: {
                Authorization: `Bearer ${sessionId}`,
            },
        });
    },
};
