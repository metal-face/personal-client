// Utilities
import { defineStore } from "pinia";
import { Session } from "@/models/Session";
import SessionServices from "@/services/SessionServices";
import { AxiosResponse } from "axios";

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
        };
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
        },
    },
    getters: {
        getSession(state: State): Session {
            return state.session;
        },
        isLoggedIn(state: State): boolean {
            return state.session.account_id !== "";
        },
        isAuthenticated: async function (state: State): Promise<boolean> {
            const rawSession = window.localStorage.getItem("session");

            if (!rawSession) return false;

            const jsonSession: Session = JSON.parse(rawSession) as Session;
            const sessionId: string = jsonSession.session_id;

            if (sessionId) {
                const res: AxiosResponse<any, any> = await SessionServices.fetchSessionById(
                    sessionId,
                );

                if (res.data.data.session_id && res.data.data.expires_at) {
                    const expiresAt: Date = new Date(res.data.data.expires_at);
                    const now: Date = new Date();

                    if (expiresAt > now) {
                        Object.assign(state.session, res.data.data as Session);
                        return true;
                    }
                }
                return false;
            }
            return false;
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
    },
});
