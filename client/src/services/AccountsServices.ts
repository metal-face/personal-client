import ApiClient from "@/clients/ApiClient";
import { AxiosResponse } from "axios";

export default {
    createAccount(
        username: string,
        email: string,
        password: string,
    ): Promise<AxiosResponse<any, any>> {
        return ApiClient({
            method: "POST",
            url: "/accounts",
            data: {
                username: username,
                email: email,
                password: password,
            },
        });
    },
    fetchAccountByEmail(email: string): Promise<AxiosResponse<any, any>> {
        return ApiClient({
            method: "GET",
            url: `/accounts?email=${email}`
        });
    },
    fetchAccountById(accountId: string): Promise<AxiosResponse<any, any>> {
        return ApiClient({
            method: "GET",
            url: `/accounts/${accountId}`,
        });
    },
    fetchManyAccounts(page: number, pageSize: number): Promise<AxiosResponse<any, any>> {
        return ApiClient({
            method: "GET",
            url: `/accounts?page=${page}&page_size=${pageSize}`,
        });
    },
    updateAccountById(
        accountId: string,
        username?: string,
        email?: string,
        password?: string,
    ): Promise<AxiosResponse<any, any>> {
        return ApiClient({
            method: "PATCH",
            url: `/accounts/${accountId}`,
            data: {
                username: username,
                email: email,
                password: password,
            },
        });
    },
    deleteAccountById(accountId: string): Promise<AxiosResponse<any, any>> {
        return ApiClient({
            method: "DELETE",
            url: `/accounts/${accountId}`,
        });
    },
};
