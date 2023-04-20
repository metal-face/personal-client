<template>
    <v-app>
        <v-app-bar flat>
            <v-btn
                @click="state.navDrawer = !state.navDrawer"
                color="white"
                icon="mdi-menu"
                variant="text"
            />
            <v-spacer />
            <v-btn
                @click="toggleTheme"
                :color="isDark ? 'yellow' : 'purple'"
                :icon="isDark ? 'mdi-white-balance-sunny' : 'mdi-weather-night'"
                variant="text"
            />
        </v-app-bar>

        <v-navigation-drawer v-model="state.navDrawer">
            <v-list>
                <v-list-item></v-list-item>
            </v-list>
        </v-navigation-drawer>

        <v-main>
            <v-container fluid>
                <router-view />
            </v-container>
        </v-main>
    </v-app>
</template>

<script setup lang="ts">
    import { useTheme } from "vuetify";
    import { reactive } from "vue";
    import { computed } from "vue";

    const theme = useTheme();

    function toggleTheme() {
        theme.global.name.value = theme.global.current.value.dark ? "light" : "dark";
    }

    const state = reactive({
        navDrawer: false,
    });

    const isDark = computed<boolean>(() => {
        return theme.global.current.value.dark;
    });
</script>
