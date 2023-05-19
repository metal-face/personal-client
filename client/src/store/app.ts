// Utilities
import { defineStore } from "pinia";

interface State {
    userEmail: string
}

export const useAppStore = defineStore("app", {
    state: (): State => ({
        userEmail: "",
    }),
    getters: {
        getUserEmail: (state: State) => state.userEmail,
    },
    actions: {
        setUserEmail(email: string): void {
            this.userEmail = email;
        }
    }
});
