// Utilities
import { defineStore } from "pinia";
import { RemovableRef, useSessionStorage } from "@vueuse/core";

interface State {
    accountId: string | RemovableRef<string>
    email: string | RemovableRef<string>
    username: string | RemovableRef<string>
    role: string | RemovableRef<string>
    createdAt: string | RemovableRef<string>
}

enum Role {
    ADMIN = "ADMIN",
    SUPER = "SUPER",
    REGULAR = "REGULAR",
}

export const useAuthStore = defineStore("auth", {
    state: (): State => ({
        accountId: useSessionStorage("email", ""),
        email: useSessionStorage("email", ""),
        username: useSessionStorage("username", ""),
        role: useSessionStorage("role", Role.REGULAR),
        createdAt: useSessionStorage("created_at", ""),
    }),
    getters: {
        getAccountId: (state: State) => state.accountId,
        getEmail: (state: State) => state.email,
        getUsername: (state: State) => state.username,
        getRole: (state: State) => state.role,
        getCreatedAt: (state: State) => state.createdAt,
    },
    actions: {
        setAccountId(userId: string): void {
            this.accountId = userId;
        },
        setUserEmail(email: string): void {
            this.email = email;
        },
        setUsername(username: string): void {
            this.username = username;
        },

        setRole(role: Role.ADMIN | Role.REGULAR | Role.SUPER) {
            this.role = role;
        },
        setCreatedAt(createdAt: string): void {
            this.createdAt = createdAt;
        },
    },
});
