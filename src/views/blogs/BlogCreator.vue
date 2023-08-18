<template>
    <v-card
        :elevation="isDark ? 0 : 12"
        :variant="isDark ? 'flat' : 'elevated'"
        class="fill-height d-flex flex-column"
        color="background">
        <v-card-title class="text-center ma-3">
            <h1 class="page-title text-decoration-underline">Create a Post</h1>
        </v-card-title>

        <v-row dense>
            <v-col cols="2">
                <v-card variant="flat" color="transparent" class="mr-1">
                    <v-select
                        v-model="codeThemePreference"
                        :items="codeTheme"
                        variant="solo"
                        density="compact"
                        item-title="text"
                        item-value="item-value"
                        label="Code Theme Preference" />
                </v-card>
            </v-col>
            <v-col cols="2">
                <v-card variant="flat" color="transparent" class="ml-auto">
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
            <v-col cols="2">
                <v-card variant="flat" color="transparent">
                    <v-text-field
                        v-model="blogPostTitle"
                        variant="plain"
                        color="primary"
                        density="compact"
                        label="Blog Post Title" />
                </v-card>
            </v-col>
            <v-col cols="12">
                <MdEditor
                    v-model="blogPostBody"
                    @onChange="sanitizeCode"
                    :theme="isDark ? 'dark' : 'light'"
                    :preview-theme="previewThemePreference"
                    :tab-width="4"
                    :table-shape="tableShape"
                    :code-theme="codeThemePreference"
                    auto-detect-code
                    no-prettier
                    show-code-row-number
                    language="en-US"
                    class="page-title" />
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
import { lineNumbers } from "@codemirror/view";
import { MdEditor, config } from "md-editor-v3";
import sanitizeHtml from "sanitize-html";
import BlogServices from "@/services/BlogServices";
import screenfull from "screenfull";
import katex from "katex";
import mermaid from "mermaid";
import Cropper from "cropperjs";
import highlight from "highlight.js";
import javascript from "highlight.js/lib/languages/javascript";
import python from "highlight.js/lib/languages/python";

import "highlight.js/styles/github.css";
import "cropperjs/dist/cropper.css";
import "md-editor-v3/lib/style.css";
import "katex/dist/katex.min.css";

let mermaidConfig = {
    startOnLoad: true,
    securityLevel: "strict",
    flowchart: { titleTopMargin: 1 },
    gantt: { titleTopMargin: 25, barHeight: 20, topPadding: 50 },
};

function sanitizeCode(code: string): void {
    blogPostBody.value = sanitize(code);
}

mermaid.initialize(mermaidConfig);

highlight.registerLanguage("javascript", javascript);
highlight.registerLanguage("python", python);

interface PreviewTheme {
    text: string;
    value: string;
}

interface CodeTheme {
    text: String;
    value: String;
}

const theme: ThemeInstance = useTheme();
const router: Router = useRouter();

config({
    editorExtensions: {
        highlight: {
            instance: highlight,
        },
        mermaid: {
            instance: mermaid,
        },
        screenfull: {
            instance: screenfull,
        },
        katex: {
            instance: katex,
        },
        cropper: {
            instance: Cropper,
        },
    },
    codeMirrorExtensions(_theme, extensions) {
        return [...extensions, lineNumbers()];
    },
});

const sanitize = (html: string): string => sanitizeHtml(html);
const blogPostBody = ref("# Write your post here.");
const blogPostTitle = ref<string>("Write a title here.");
const tableShape = reactive<number[]>([8, 4]);
const previewThemePreference = ref<string>("github");
const codeThemePreference = ref<string>("github");

const previewTheme = reactive<PreviewTheme[]>([
    { text: "Default", value: "default" },
    { text: "GitHub", value: "github" },
    { text: "MKCute", value: "mk-cute" },
    { text: "Cyanosis", value: "cyanosis" },
]);
const codeTheme = reactive<CodeTheme[]>([
    { text: "Atom", value: "atom" },
    { text: "a11y", value: "a11y" },
    { text: "GitHub", value: "github" },
    { text: "Gradient", value: "gradient" },
    { text: "Kimbie", value: "kimbie" },
    { text: "Paraiso", value: "paraiso" },
    { text: "QTCreator", value: "qtcreator" },
    { text: "StackOverflow", value: "stackoverflow" },
]);

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
            router.push({ name: "UserBlogPosts" });
        })
        .catch((err) => {
            console.error(err);
        });
}
</script>
<style>
.default-theme h1 {
    margin: 0 !important;
}
.page-title {
    font-family: "Prata", "serif";
}
</style>
