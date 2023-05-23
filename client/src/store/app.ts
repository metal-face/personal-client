// Utilities
import { defineStore } from "pinia";
import { RemovableRef, useLocalStorage } from "@vueuse/core"

interface State {
    email: string | RemovableRef<string>
    username: string
    password: string
}

export const useAppStore = defineStore("app", {
    state: (): State  => ({
        email: useLocalStorage("email", ""),
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
            this.email = email;
        },
        setUsername(username: string): void {
            this.username = username;
        },
        setPassword(password: string): void {
            this.password = password;
        },
        
    }
});
