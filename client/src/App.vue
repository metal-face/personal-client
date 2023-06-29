<template>
    <v-app>
        <v-app-bar flat color="background">
            <v-btn
                @click="navDrawer = !navDrawer"
                :color="isDark ? 'white' : 'black'"
                icon="mdi-menu"
                variant="text" />
            <v-spacer />
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
            <v-container fluid class="pa-0 fill-height">
                <router-view @account:change="setAccountData" />
            </v-container>
        </v-main>
    </v-app>
</template>

<script setup lang="ts">
import { useTheme } from "vuetify";
import { computed, ref } from "vue";
import { reactive } from "vue";
import { Account, Role } from "@/models/Account";

const theme = useTheme();

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
