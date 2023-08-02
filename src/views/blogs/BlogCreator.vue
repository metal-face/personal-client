<template>
    <v-card
        :elevation="isDark ? 0 : 12"
        :variant="isDark ? 'flat' : 'elevated'"
        class="fill-height d-flex flex-column"
        color="background">
        <v-card-title class="text-center ma-3">
            <h1 class="page-title text-decoration-underline">Create a Post</h1>
        </v-card-title>
        <v-card-text class="fill-height">
            <v-text-field
                v-model="blogPostTitle"
                :counter="100"
                :bg-color="isDark ? 'black' : 'white'"
                variant="outlined"
                label="Blog Title" />
            <v-row>
                <v-col cols="6">
                    <v-textarea
                        v-model="blogPostBody"
                        :bg-color="isDark ? 'black' : 'white'"
                        @input="update"
                        variant="outlined"
                        auto-grow
                        label="Blog Post"
                        class="fill-height mb-2"
                        placeholder="You write your blog post here!" />
                </v-col>
                <v-col cols="6">
                    <div v-html="markdownOutput" class="" />
                </v-col>
            </v-row>
        </v-card-text>
        <v-card-actions class="d-flex flex-column ma-0 pa-0">
            <v-btn
                @click="createBlogPost"
                :color="isDark ? 'white' : 'black'"
                class="ma-0 pa-0"
                rounded="0"
                size="x-large"
                variant="flat"
                block>
                Save
            </v-btn>
            <v-btn
                @click="router.push({ name: 'UserBlogPosts' })"
                :color="isDark ? 'black' : 'white'"
                class="ma-0 pa-0"
                rounded="0"
                size="x-large"
                variant="flat"
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
import { Session } from "@/models/Session";
import { marked } from "marked";
import { debounce } from "lodash-es";
import BlogServices from "@/services/BlogServices";

const theme: ThemeInstance = useTheme();
const router: Router = useRouter();

const blogPostTitle = ref<string>("");
const blogPostBody = ref("");
const markdownOutput = computed(() => marked(blogPostBody.value));

const update = debounce((e: any) => {
    blogPostBody.value = e.target.value;
}, 100);

const sessionFromStorage: string = window.localStorage.getItem("session")!;
const session: Session = JSON.parse(sessionFromStorage);

const darkState = computed<string>(() => {
    return theme.global.name.value;
});

const isDark = computed<boolean>(() => {
    return darkState.value === "customDarkTheme";
});

async function createBlogPost() {
    BlogServices.createBlogPost(blogPostTitle.value, blogPostBody.value, session.account_id)
        .then((res) => {
            console.log(res);
            router.push({ name: "UserBlogPosts" });
        })
        .catch((err) => {
            console.error(err);
        });
}
</script>
<style scoped>
.page-title {
    font-family: "Prata", "serif";
}
</style>
