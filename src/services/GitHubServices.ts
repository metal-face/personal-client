import ApiClient from "@/clients/ApiClient";

export default {
    registerGitHubIdentity(clientId: string) {
        return ApiClient({
            method: "GET",
            url: `https://github.com/login/oauth/authorize?clientId=${clientId}`,
        })
    }
}