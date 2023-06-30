<template>
    <v-app>
        <v-app-bar flat color="background">
            <v-btn
                @click="navDrawer = !navDrawer"
                :color="isDark ? 'white' : 'black'"
                icon="mdi-menu"
                variant="text" />
            <v-spacer />

            <v-card color="primary" class="d-flex justify-center align-center">
                <v-btn
                    @click="router.push({ name: 'Login' })"
                    rounded="0"
                    variant="text"
                    color="accent">
                    Login
                </v-btn>
                <v-divider vertical />
                <v-btn
                    @click="
                        router.push({
                            name: 'Register',
                            params: { email: 'putyouremail@here.com' },
                        })
                    "
                    rounded="0"
                    variant="text"
                    color="accent">
                    Register
                </v-btn>
            </v-card>
            <v-btn
                @click="toggleTheme"
                :color="isDark ? 'yellow' : 'purple'"
                :icon="isDark ? 'mdi-white-balance-sunny' : 'mdi-weather-night'"
                variant="text" />
        </v-app-bar>

        <v-navigation-drawer v-model="navDrawer" color="secondary">
            <v-list>
                <v-list-item></v-list-item>
            </v-list>
        </v-navigation-drawer>

        <v-main>
            <v-container fluid class="fill-height">
                <router-view @account:change="setAccountData" />
            </v-container>
        </v-main>
    </v-app>
</template>

<script setup lang="ts">
import { ThemeInstance, useTheme } from "vuetify";
import { computed, ref } from "vue";
import { reactive } from "vue";
import { Account, Role } from "@/models/Account";
import { Router, useRouter } from "vue-router";

const theme: ThemeInstance = useTheme();
const router: Router = useRouter();

const account: Account = reactive({
    account_id: "",
    username: "",
    email: "",
    role: Role.REGULAR,
    created_at: new Date(),
});

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
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Playfair+Display&family=Source+Code+Pro&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Prata&display=swap");
</style>
