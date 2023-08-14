<template>
    <v-row justify="center" class="fill-height">
        <v-col cols="12">
            <router-view />
        </v-col>
    </v-row>
</template>
<script setup lang="ts">
import { useDisplay, useTheme, ThemeInstance, DisplayInstance } from "vuetify";
import { computed } from "vue";

const display: DisplayInstance = useDisplay();
const theme: ThemeInstance = useTheme();

const isMobile = computed<boolean>(() => {
    return display.mobile.value;
});
</script>
<style scoped>
.page-title {
    font-family: "Prata", "serif";
}
</style>
