// Utilities
import { defineStore } from "pinia";

interface State {
    session: Session | {};
}


export const sessionStore = defineStore("session", {
    state: (): State => {
        return {
            session: {},
        }
    },
    actions: {
        setSession(session: Session) {
            window.localStorage.setItem("session", JSON.stringify(session));
            Object.assign(this.session, session);
        }
    },
    getters: {
        getSession(state: State) {
            return state.session;
        },
    }
});

interface Session {
    accountId?: string;
    sessionId?: string;
    createdAt?: string;
    expiresAt?: string;
    userAgent?: string;
}