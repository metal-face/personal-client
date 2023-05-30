<template>
    <v-app>
        <v-app-bar flat color="primary">
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
                <router-view />
            </v-container>
        </v-main>
    </v-app>
</template>

<script setup lang="ts">
import { useTheme } from "vuetify";
import { ref } from "vue";
import { computed } from "vue";

const theme = useTheme();

function toggleTheme(): void {
    theme.global.name.value = theme.global.current.value.dark ? "light" : "dark";
}

const navDrawer = ref<boolean>(false);

const isDark = computed<boolean>(() => {
    return theme.global.current.value.dark;
});
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Playfair+Display&family=Source+Code+Pro&display=swap");
@import url('https://fonts.googleapis.com/css2?family=Prata&display=swap');
</style>
