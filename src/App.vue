<template>
    <v-app>
        <v-app-bar color="background" location="top">
            <v-btn
                @click="navDrawer = !navDrawer"
                :color="isDark ? 'white' : 'black'"
                icon="mdi-menu"
                variant="text" />
            <v-spacer />

            <v-card
                v-if="isLoggedIn"
                density="compact"
                color="primary"
                class="d-flex justify-center align-center">
                <v-btn
                    variant="elevated"
                    class="white--text"
                    :color="isDark ? 'white' : 'black'"
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
                variant="text" />
        </v-app-bar>

        <v-navigation-drawer
            v-model="navDrawer"
            color="primary"
            temporary
            disable-resize-watcher
            disable-route-watcher>
            <v-list nav>
                <v-list-item
                    v-for="(link, i) in links"
                    :key="i"
                    @click="handleRedirection(link)">
                    <template #prepend>
                        <v-icon :icon="link.props.prependIcon" />
                    </template>
                    <v-list-item-title>{{ link.text }}</v-list-item-title>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>

        <v-main>
            <v-container id="app" fluid class="fill-height">
                <router-view @account:change="setAccountData" />
            </v-container>
        </v-main>
    </v-app>
</template>

<script setup lang="ts">
import { ThemeInstance, useTheme } from "vuetify";
import { computed, ref, reactive, ComputedRef } from "vue";
import { useRouter, Router} from "vue-router";
import { Account, Role } from "@/models/Account";
import { useAccountStore } from "@/store/AccountStore";
import { sessionStore } from "@/store/SessionStore";
import SessionServices from "@/services/SessionServices";

const theme: ThemeInstance = useTheme();
const accountStore = useAccountStore();
const sessStore = sessionStore();
const router: Router = useRouter();

const isLoggedIn: ComputedRef<boolean> = computed(() => {
    return accountStore.isLoggedIn;
});

const sessionId: ComputedRef<string> = computed(() => {
    return sessStore.getSessionId;
});

const account: Account = reactive({
    account_id: "",
    username: "",
    email: "",
    role: Role.REGULAR,
    created_at: new Date(),
});

interface Link {
    text: string;
    value: string;
    props: Record<string, string>;
}

const links: Link[] = [
    { text: "Home", value: "Home", props: { prependIcon: "mdi-home-circle" } },
    { text: "Blogs", value: "UserBlogPosts", props: { prependIcon: "mdi-post-outline" } },
];

function handleRedirection(link: Link): void {
    navDrawer.value = !navDrawer.value;

    router.push({ name: link.value });
}

function setAccountData(payload: Account): void {
    Object.assign(account, payload);
}

function toggleTheme(): void {
    theme.global.name.value = theme.global.current.value.dark
        ? "customLightTheme"
        : "customDarkTheme";
}

const navDrawer = ref<boolean>(false);

const isDark = computed<boolean>(() => {
    return theme.global.current.value.dark;
});

function logoutUser() {
    SessionServices.logout(sessionId.value)
        .catch((err) => {
            console.error(err);
        })
        .then((res) => {
            if (!res) return;
            sessStore.destroySessionInStorage();
            sessStore.clearSession();
            window.location.reload();
        });
}
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Playfair+Display&family=Source+Code+Pro&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Prata&display=swap");
</style>
