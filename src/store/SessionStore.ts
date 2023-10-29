// Utilities
import { defineStore } from "pinia";
import { Session } from "@/models/Session";
import { computed, ComputedRef, Ref, ref } from "vue";

export const sessionStore = defineStore("session", () => {
    const session: Ref<Session> = ref<Session>({
        account_id: "",
        session_id: "",
        created_at: new Date(),
        expires_at: new Date(),
        user_agent: "",
    });

    const blankSession: Ref<Session> = ref<Session>({
        account_id: "",
        session_id: "",
        created_at: new Date(),
        expires_at: new Date(),
        user_agent: "",
    });

    function setSession(payload: Session): void {
        window.localStorage.setItem("session", JSON.stringify(payload));
        session.value = payload;
    }

    function clearSession(): void {
        session.value = blankSession.value;
    }

    function destroySessionInStorage(): void {
        window.localStorage.removeItem("session");
    }

    const getSession: ComputedRef<Session> = computed<Session>(() => {
        return session.value;
    });

    const isLoggedIn: ComputedRef<boolean> = computed<boolean>(() => {
        return session.value.account_id !== "";
    });

    const isExpired: ComputedRef<boolean> = computed<boolean>(() => {
        return session.value.expires_at < new Date();
    });

    const getSessionId: ComputedRef<string> = computed<string>(() => {
        return session.value.session_id;
    });

    const expiresAt: ComputedRef<Date> = computed<Date>(() => {
        return session.value.expires_at;
    });

    const accountID: ComputedRef<string> = computed<string>(() => {
        return session.value.account_id;
    });

    return {
        setSession,
        clearSession,
        destroySessionInStorage,
        getSession,
        isLoggedIn,
        isExpired,
        getSessionId,
        expiresAt,
        accountID,
    };
});
