// Utilities
import { defineStore } from "pinia";
import { RemovableRef, useLocalStorage } from "@vueuse/core"

interface State {
    email: RemovableRef<string> | string,
    username: RemovableRef<string> | string,
    password: string
}

export const useAppStore = defineStore("app", {
    state: (): State  => ({
        email: useLocalStorage("email", ""),
        username: useLocalStorage("username", ""),
        password: "",
    }),
    getters: {
        getUserEmail: (state: State) => state.email,
    },
    actions: {
        setUserEmail(email: string): void {
            this.email = email;
        }
    }
});
