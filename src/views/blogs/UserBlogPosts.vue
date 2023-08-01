<script setup lang="ts">
import { ThemeInstance, useTheme } from "vuetify";
import { computed } from "vue";

const theme: ThemeInstance = useTheme();

let isDark = computed<boolean>(() => {
    return theme.global.current.value.dark;
});
</script>
<style scoped>
.page-title {
    font-family: "Prata", "serif";
}
</style>
<template>
    <v-card elevation="12" variant="elevated" color="primary" rounded="1" class="fill-height">
        <!-- TODO: list all blogs for the signed in user -->
        <!-- TODO: if there are no blogs, diplay an indicator to create a blog. -->
        <!-- TODO: add a create button that redirects the user to the create page. -->
        <v-card variant="flat" color="primary" rounded="1">
            <v-card-title class="page-title text-center ma-3">
                <h1 class="text-decoration-underline">Blog Posts</h1>
            </v-card-title>
        </v-card>
        <v-btn
            :to="{ name: 'BlogCreator' }"
            :color="isDark ? 'white' : 'black'"
            position="absolute"
            location="bottom right"
            variant="elevated"
            size="x-large"
            rounded="3"
            class="ma-3"
            icon="mdi-pencil">
        </v-btn>
    </v-card>
</template>
