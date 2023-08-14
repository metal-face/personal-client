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
            <v-row dense no-gutters justify="center" align-content="center">
                <v-col cols="3">
                    <v-card variant="flat" color="transparent" class="ma-1">
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
            </v-row>
            <v-col cols="12">
                <MdEditor
                    v-model="userInput"
                    language="en-US"
                    class="page-title"
                    :theme="isDark ? 'dark' : 'light'"
                    :sanitize="sanitize"
                    :preview-theme="previewThemePreference"
                    :tab-width="4"
                    :completions="completions"
                    :table-shape="tableShape"
                    code-theme="github"
                    auto-detect-code
                    no-prettier
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
import { lineNumbers } from "@codemirror/view";
import { MdEditor, config } from "md-editor-v3";
import { CompletionSource } from "@codemirror/autocomplete";
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

mermaid.initialize(mermaidConfig);

highlight.registerLanguage("javascript", javascript);
highlight.registerLanguage("python", python);

interface PreviewTheme {
    text: string;
    value: string;
}

const theme: ThemeInstance = useTheme();
const router: Router = useRouter();

const completions = ref<Array<CompletionSource>>([
    (context) => {
        const word = context.matchBefore(/@\w*/);

        if (word === null || (word.from == word.to && context.explicit)) {
            return null;
        }

        return {
            from: word.from,
            options: [
                {
                    label: "@imzbf",
                    type: "text",
                },
            ],
        };
    },
]);

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
const userInput = ref("# Start your post here!");
const tableShape = reactive<number[]>([8, 4]);
const previewThemePreference = ref<string>("default");

const previewTheme = reactive<PreviewTheme[]>([
    { text: "Default", value: "default" },
    { text: "GitHub", value: "github" },
    { text: "VuePress", value: "vuepress" },
    { text: "MKCute", value: "mk-cute" },
    { text: "Smart Blue", value: "smart-blue" },
    { text: "Cyanosis", value: "cyanosis" },
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
