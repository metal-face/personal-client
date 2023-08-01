<template>
    <v-card elevation="12" class="fill-height d-flex flex-column" color="background">
        <v-card-title class="text-center ma-3">
            <h1 class="page-title text-decoration-underline">Create a Post</h1>
        </v-card-title>
        <v-card-text class="fill-height">
            <v-text-field
                v-model="blogPostTitle"
                :counter="100"
                variant="outlined"
                :bg-color="isDark ? 'black' : 'white'"
                label="Blog Title" />
            <v-textarea
                v-model="blogPostBody"
                variant="outlined"
                :bg-color="isDark ? 'black' : 'white'"
                label="Blog Post"
                class="fill-height mb-2"
                auto-grow
                placeholder="You write your blog post here!" />
        </v-card-text>
        <v-card-actions class="d-flex flex-column ma-0 pa-0">
            <v-btn class="ma-0 pa-0" rounded="0" size="x-large" variant="flat" color="accent" block>
                Save
            </v-btn>
            <v-btn
                @click="router.push({ name: 'UserBlogPosts' })"
                class="ma-0 pa-0"
                rounded="0"
                size="x-large"
                variant="flat"
                color="secondary"
                block>
                Cancel
            </v-btn>
        </v-card-actions>
    </v-card>
</template>
<script setup lang="ts">
import { useRouter, Router } from "vue-router";
import { ref, computed } from "vue";
import { ThemeInstance, useTheme } from "vuetify";

const theme: ThemeInstance = useTheme();
const router: Router = useRouter();

const blogPostTitle = ref<string>("");
const blogPostBody = ref<string>("");
const darkState = computed<string>(() => {
    return theme.global.name.value;
});
const isDark = computed<boolean>(() => {
    return darkState.value === "customDarkTheme";
});
</script>
<style scoped>
.page-title {
    font-family: "Prata", "serif";
}
</style>
