<template>
    <v-app>
        <v-app-bar color="background" location="top" flat>
            <div class="ml-4" v-if="isLoggedIn">
                <v-btn
                    @click="navDrawer = !navDrawer"
                    :color="isDark ? 'white' : 'black'"
                    icon="mdi-menu"
                    variant="text" />
            </div>
            <v-spacer />

            <v-card
                v-if="isLoggedIn"
                density="compact"
                color="primary"
                class="mr-2 d-flex justify-center align-center">
                <v-btn
                    variant="elevated"
                    class="white--text"
                    color="primary"
                    rounded="1"
                    prepend-icon="mdi-account-circle">
                    {{ account.username }}
                    <v-menu
                        activator="parent"
                        location="bottom"
                        open-on-click
                        close-on-content-click
                        height="auto">
                        <v-list density="compact" bg-color="primary" class="ma-1 pa-0">
                            <v-list-item @click="logoutUser" density="compact" active-color="red">
                                <v-list-item-title> Logout </v-list-item-title>
                                <template #append>
                                    <v-icon color="red" size="large">mdi-power</v-icon>
                                </template>
                            </v-list-item>
                        </v-list>
                    </v-menu>
                </v-btn>
            </v-card>
            <v-btn
                @click="toggleDark"
                :color="isDark ? 'yellow' : 'purple'"
                :icon="isDark ? 'mdi-white-balance-sunny' : 'mdi-weather-night'"
                variant="elevated" />
        </v-app-bar>

        <v-navigation-drawer
            v-model="navDrawer"
            color="primary"
            temporary
            disable-resize-watcher
            disable-route-watcher>
            <v-list nav>
                <v-list-item v-for="(link, i) in links" :key="i" @click="handleRedirection(link)">
                    <template #prepend>
                        <v-icon :icon="link.props.prependIcon" />
                    </template>
                    <v-list-item-title>{{ link.text }}</v-list-item-title>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>

        <v-main>
            <v-container id="app" fluid class="fill-height">
                <router-view
                    @account:change="setAccountData"
                    @username:update="handleUsernameUpdate" />
            </v-container>
        </v-main>
    </v-app>
</template>

<script setup lang="ts">
import { ThemeInstance, useTheme } from "vuetify";
import { computed, ref, reactive, onMounted, ComputedRef, nextTick } from "vue";
import { useRouter, Router } from "vue-router";
import { Account, Role } from "@/models/Account";
import { useAccountStore } from "@/store/AccountStore";
import { sessionStore } from "@/store/SessionStore";
import { Session } from "@/models/Session";
import SessionServices from "@/services/SessionServices";
import AccountsServices from "@/services/AccountsServices";

onMounted(() => {
    const viewModePreference: string | null = window.localStorage.getItem("viewModePreference");

    if (viewModePreference === "light") {
        setTheme("customLightTheme");
    }
    if (viewModePreference === "dark") {
        setTheme("customDarkTheme");
    }
});

onMounted(async () => {
    const resp = window.localStorage.getItem("session");

    if (resp) {
        const jsonResponse = JSON.parse(resp) as Session;
        Object.assign(session, jsonResponse);

        if (Object.keys(session).length) {
            // First check if the session even exists.
            if (session.session_id) {
                const sessionExists = await fetchSessionById();
                // If no session exists, clear the content of the account store.
                if (!sessionExists) {
                    accountStore.clearAccount();
                    sessStore.clearSession();
                    sessStore.destroySessionInStorage();
                    return;
                }
            }

            // Then check if session is expired.
            if (sessStore.isExpired) {
                // clear the session from local storage
                sessStore.destroySessionInStorage();
                // clear the contents of the session store.
                sessStore.clearSession();
                // clear the session in the server
                logoutUser();
                // exit the function.
                return;
            }

            // If it's a valid session, fetch the user's account.
            if (session.account_id) {
                sessStore.setSession(session);
                await fetchAccountById();
            }
        }
    }
});

interface Link {
    text: string;
    value: string;
    props: Record<string, string>;
}

const theme: ThemeInstance = useTheme();
const accountStore = useAccountStore();
const sessStore = sessionStore();
const router: Router = useRouter();

const session: Session = reactive({
    account_id: "",
    session_id: "",
    created_at: new Date(),
    expires_at: new Date(),
    user_agent: "",
});

const account: Account = reactive({
    account_id: "",
    username: "",
    email: "",
    role: Role.REGULAR,
    created_at: new Date(),
});

const isLoggedIn: ComputedRef<boolean> = computed(() => {
    return accountStore.isLoggedIn;
});

const links: Link[] = [
    { text: "Home", value: "Home", props: { prependIcon: "mdi-home-circle" } },
    // { text: "Uses", value: "Uses", props: { prependIcon: "mdi-slash-forward" } },
    { text: "Your Blogs", value: "BlogPosts", props: { prependIcon: "mdi-post-outline" } },
    { text: "Blog Feed", value: "BlogFeed", props: { prependIcon: "mdi-broadcast" } },
];

const navDrawer = ref<boolean>(false);

const isDark = computed<boolean>(() => {
    return theme.global.current.value.dark;
});

const sessionId = computed<string>(() => {
    return sessStore.getSessionId;
});

function toggleDark(event: MouseEvent) {
    const isAppearanceTransition =
        // @ts-expect-error experimental API
        document.startViewTransition &&
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!isAppearanceTransition) {
        toggleTheme();
        return;
    }

    const x = event.clientX;
    const y = event.clientY;
    const endRadius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    // @ts-expect-error: Transition API
    const transition = document.startViewTransition(async () => {
        toggleTheme();
        await nextTick();
    });
    transition.ready.then(() => {
        const clipPath = [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${endRadius}px at ${x}px ${y}px)`,
        ];
        document.documentElement.animate(
            {
                clipPath: isDark.value ? [...clipPath].reverse() : clipPath,
            },
            {
                duration: 400,
                easing: "ease-in-out",
                pseudoElement: isDark.value
                    ? "::view-transition-old(root)"
                    : "::view-transition-new(root)",
            },
        );
    });
}

function handleRedirection(link: Link): void {
    navDrawer.value = !navDrawer.value;

    router.push({ name: link.value });
}

function handleUsernameUpdate(payload: string): void {
    account.username = payload;
}

function setAccountData(payload: Account): void {
    Object.assign(account, payload);
}

function setTheme(preference: string): void {
    theme.global.name.value = preference;

    preference === "customDarkMode"
        ? window.localStorage.setItem("viewModePreference", "dark")
        : window.localStorage.setItem("viewModePreference", "light");
}

function toggleTheme(): void {
    theme.global.name.value = theme.global.current.value.dark
        ? "customLightTheme"
        : "customDarkTheme";

    theme.global.current.value.dark
        ? window.localStorage.setItem("viewModePreference", "dark")
        : window.localStorage.setItem("viewModePreference", "light");
}

function logoutUser() {
    SessionServices.logout(sessionId.value)
        .then(() => {
            sessStore.destroySessionInStorage();
            sessStore.clearSession();
            window.location.reload();
        })
        .catch((err) => {
            console.error(err);
        });
}

async function fetchSessionById(): Promise<boolean> {
    return SessionServices.fetchSessionById(session.session_id)
        .then((res) => {
            sessStore.setSession(res.data.data as Session);
            return true;
        })
        .catch((err) => {
            console.error(err);
            return false;
        });
}

async function fetchAccountById(): Promise<boolean> {
    return AccountsServices.fetchAccountById(session.account_id)
        .then((res) => {
            Object.assign(account, res.data.data);
            accountStore.setAccount(account);
            return true;
        })
        .catch((err) => {
            console.warn(err.response);
            return false;
        });
}
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Playfair+Display&family=Source+Code+Pro&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Prata&display=swap");

p,
h1 {
    margin: 0 !important;
    word-break: break-word !important;
}
</style>
