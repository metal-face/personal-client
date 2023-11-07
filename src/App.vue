<template>
    <v-app>
        <CircleLoader :loading="loading" circle-color="accent" />
        <v-app-bar color="background" location="top" flat>
            <div class="ml-4" v-if="isLoggedIn">
                <v-btn
                    @click="navDrawer = !navDrawer"
                    :color="isDark ? 'white' : 'black'"
                    icon
                    variant="text">
                    <template #default>
                        <MenuIcon />
                    </template>
                </v-btn>
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
                @click="toggleTheme"
                :color="isDark ? 'yellow' : 'purple'"
                :icon="isDark ? 'mdi-white-balance-sunny' : 'mdi-weather-night'"
                variant="elevated" />
        </v-app-bar>

        <v-navigation-drawer
            v-model="navDrawer"
            color="secondary"
            temporary
            disable-resize-watcher
            disable-route-watcher>
            <v-list nav>
                <div v-for="(link, i) in links" :key="i">
                    <v-list-item
                        v-if="currentRoute !== link.value"
                        @click="handleRedirection(link)">
                        <template #prepend>
                            <v-icon :icon="link.props.prependIcon" />
                        </template>
                        <v-list-item-title>{{ link.text }}</v-list-item-title>
                    </v-list-item>
                </div>
            </v-list>
        </v-navigation-drawer>

        <v-main>
            <v-container id="app" fluid>
                <router-view
                    @account:change="setAccountData"
                    @username:update="handleUsernameUpdate" />
            </v-container>
        </v-main>
    </v-app>
</template>

<script setup lang="ts">
import { ThemeInstance, useTheme } from "vuetify";
import { computed, ref, reactive, onMounted, ComputedRef, Ref, nextTick } from "vue";
import { useRouter, Router } from "vue-router";
import { Account, Role } from "@/models/Account";
import { useAccountStore } from "@/store/AccountStore";
import { sessionStore } from "@/store/SessionStore";
import { Session } from "@/models/Session";
import SessionServices from "@/services/SessionServices";
import AccountsServices from "@/services/AccountsServices";
import CircleLoader from "@/components/utils/CircleLoader.vue";
import MenuIcon from "@/components/icons/MenuIcon.vue";

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
    loading.value = true;

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
                    loading.value = false;
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
                await logoutUser();
                // turn off the loader
                loading.value = false;
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
    loading.value = false;
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

const loading: Ref<boolean> = ref<boolean>(false);

const isLoggedIn: ComputedRef<boolean> = computed(() => {
    return accountStore.isLoggedIn;
});

const currentRoute: ComputedRef<string> = computed<string>(() => {
    return router.currentRoute.value.name ? (router.currentRoute.value.name as string) : "Home";
});

const links: Link[] = [
    { text: "Home", value: "Home", props: { prependIcon: "mdi-home-circle" } },
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

function handleRedirection(link: Link): void {
    navDrawer.value = false;

    nextTick(() => {
        router.push({ name: link.value });
    });
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

async function logoutUser() {
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
@import url("https://fonts.googleapis.com/css2?family=Prata&family=Source+Code+Pro&display=swap");
p,
h1 {
    margin: 0 !important;
    word-break: break-word !important;
}

.grecaptcha-badge {
    display: none;
}

@font-face {
    font-family: "Pacifico";
    font-style: normal;
    font-weight: 400;
    src: local("Pacifico Regular"), local("Pacifico-Regular"),
        url(https://fonts.gstatic.com/s/pacifico/v12/FwZY7-Qmy14u9lezJ-6H6MmBp0u-.woff2)
            format("woff2");
    font-display: swap;
}
</style>
