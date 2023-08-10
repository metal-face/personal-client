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
            <v-col cols="12">
                <MdEditor
                    v-model="userInput"
                    language="en-US"
                    :theme="isDark ? 'dark' : 'light'"
                    :sanitize="sanitize"
                    :preview-theme="previewThemePreference"
                    :code-theme="codeThemePreference"
                    :page-fullscreen="fullscreen"
                    :preview="preview"
                    :tab-width="4"
                    :table-shape="tableShape"
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
import { MdEditor, config } from "md-editor-v3";
import sanitizeHtml from "sanitize-html";
import BlogServices from "@/services/BlogServices";
import "md-editor-v3/lib/style.css";
import { lineNumbers } from "@codemirror/view";

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
    codeMirrorExtensions(_theme, extensions) {
        return [...extensions, lineNumbers()];
    },
    editorConfig: {
        // mermaid template
        mermaidTemplate: {
            flow: `flow`,
            sequence: `sequence`,
            gantt: `gantt`,
            class: `class`,
            state: `state`,
            pie: `pie`,
            relationship: `relationship`,
            journey: `journey`,
        },
    },

    editorExtensions: {
        highlight: {
            css: {
                atom: {
                    light: "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.5.1/styles/atom-one-light.min.css",
                    dark: "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.5.1/styles/atom-one-dark.min.css",
                },
                xxx: {
                    light: "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.5.1/styles/xxx-light.css",
                    dark: "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.5.1/styles/xxx-dark.css",
                },
            },
        },
    },
});

const sanitize: any = (html: string) => sanitizeHtml(html);
const userInput = ref("# You can write markdown here!");
const preview = ref<boolean>(true);
const tableShape = reactive<number[]>([8, 4]);
const previewThemePreference = ref<string>("github");
const codeThemePreference = ref<string>("github");

const previewTheme = reactive<PreviewTheme[]>([
    { text: "Default", value: "default" },
    { text: "GitHub", value: "github" },
    { text: "VuePress", value: "vuepress" },
    { text: "MKCute", value: "mk-cute" },
    { text: "Smart Blue", value: "smart-blue" },
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
