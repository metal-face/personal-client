<template>
    <v-card
        :elevation="isDark ? 0 : 12"
        :variant="isDark ? 'flat' : 'elevated'"
        class="fill-height d-flex flex-column"
        color="background">
        <v-card-title class="text-center ma-3">
            <h1 class="page-title text-decoration-underline">Create a Post</h1>
        </v-card-title>

        <v-row dense no-gutters>
            <v-col cols="12">
                <v-card variant="flat" color="transparent" width="25%" class="ml-auto">
                    <v-select
                        v-model="previewThemePreference"
                        :items="previewTheme"
                        :menu-props="{
                            offset: 5,
                        }"
                        item-title="text"
                        item-value="value"
                        density="compact"
                        label="Select preview theme"
                        variant="solo" />
                </v-card>
            </v-col>
            <v-col cols="12">
                <MdEditor
                    v-model="text"
                    language="en-US"
                    :theme="isDark ? 'dark' : 'light'"
                    :sanitize="sanitize"
                    :preview-theme="previewThemePreference"
                    auto-detect-code
                    show-code-row-number />
            </v-col>
        </v-row>

        <v-card-actions class="d-flex flex-column ma-0 pa-0">
            <v-btn
                @click="createBlogPost"
                :color="isDark ? 'accent' : 'black'"
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
import { ref, computed, reactive } from "vue";
import { ThemeInstance, useTheme } from "vuetify";
import { Session } from "@/models/Session";
import { MdEditor } from "md-editor-v3";
import sanitizeHtml from "sanitize-html";
import BlogServices from "@/services/BlogServices";
import "md-editor-v3/lib/style.css";

interface PreviewTheme {
    text: string;
    value: string;
}

const theme: ThemeInstance = useTheme();
const router: Router = useRouter();

const text = ref("# You can write markdown here!");
const sanitize: any = (html: string) => sanitizeHtml(html);

const previewTheme = reactive<PreviewTheme[]>([
    { text: "Default", value: "default" },
    { text: "GitHub", value: "github" },
    { text: "VuePress", value: "vuepress" },
    { text: "MKCute", value: "mk-cute" },
    { text: "Smart Blue", value: "smart-blue" },
    { text: "Cyanosis", value: "cyanosis" },
]);

const previewThemePreference = ref<string>("");

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

.markdown-output {
    height: 100%;
}
</style>
