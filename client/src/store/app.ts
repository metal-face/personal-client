// Utilities
import { defineStore } from "pinia";
import { useLocalStorage } from "@vueuse/core"

interface State {
    email: string
    username: string
    password: string
}

export const useAppStore = defineStore("app", {
    state: (): State  => ({
        email: useLocalStorage("email", "").value,
        username: "",
        password: "",
    }),
    getters: {
        getEmail: (state: State) => state.email,
        getUsername: (state: State) => state.username,
        getPassword: (state: State) => state.password,
    },
    actions: {
        setUserEmail(email: string): void {
            this.email = useLocalStorage("email", email).value;
        },
        setUsername(username: string): void {
            this.username = username;
        },
        setPassword(password: string): void {
            this.password = password;
        },
        
    }
});
