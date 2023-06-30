// Utilities
import { defineStore } from "pinia";
import { Session } from "@/models/Session"

interface State {
    session: Session;
    emptySession: Session;
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
            emptySession: {
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
        destroySessionInStorage(): void {
            window.localStorage.removeItem("session");
        },
        clearSession(): void {
            Object.assign(this.session, this.emptySession);
        }
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
        getSessionId(state: State): string {
            return state.session.session_id;
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