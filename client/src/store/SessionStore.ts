// Utilities
import { defineStore } from "pinia";
import { Session } from "@/models/Session"

interface State {
    session: Session;
}

export const sessionStore = defineStore("session", {
    state: (): State => {
        return {
            session: {
                account_id: "",
                session_id: "",
                created_at: new Date(),
                expires_at: new Date(),
                user_agent: "",
            },
        }
    },
    actions: {
        setSession(session: Session): void {
            window.localStorage.setItem("session", JSON.stringify(session));
            Object.assign(this.session, session);
        },
        destroySession(): void {
            window.localStorage.removeItem("session");
        },
    },
    getters: {
        getSession(state: State): Session {
            return state.session;
        },
        isLoggedIn(state: State): boolean {
            return state.session.account_id !== "";
        },
        isExpired(state: State): boolean {
           return state.session.expires_at < new Date();
        },
        createdAt(state: State): Date {
            return state.session.created_at;
        },
        expiresAt(state: State): Date {
            return state.session.expires_at;
        },
        accountID(state: State): string {
            return state.session.account_id;
        },
    }
});