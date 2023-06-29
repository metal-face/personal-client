// Utilities
import { defineStore } from "pinia";
import { Session } from "@/models/Session"

interface State {
    session: Session | {};
}


export const sessionStore = defineStore("session", {
    state: (): State => {
        return {
            session: {
                account_id: "",
                session_id: "",
                created_at: "",
                expires_at: "",
                user_agent: "",
            },
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