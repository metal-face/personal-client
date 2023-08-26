<template>
    <v-row class="fill-height" justify="center" align="center" dense no-gutters>
        <v-col :cols="editorWidth">
            <v-card
                :elevation="isDark ? 0 : 12"
                :variant="isDark ? 'flat' : 'elevated'"
                class="fill-height"
                color="background">
                <v-row justify="center" align-content="center">
                    <!-- Actual Title -->
                    <v-col v-if="!titleState" :cols="12">
                        <v-card
                            @click="titleState = true"
                            flat
                            color="transparent"
                            class="d-flex justify-center align-center">
                            <v-badge
                                v-model="editBadge.visible"
                                :color="editBadge.color"
                                offset-x="15"
                                offset-y="15"
                                location="top end"
                                bordered>
                                <template #badge>
                                    <v-icon size="large">
                                        {{ editBadge.icon }}
                                    </v-icon>
                                </template>
                                <v-card-title class="ma-3">
                                    <h1 class="page-title">{{ blogPostTitle }}</h1>
                                </v-card-title>
                            </v-badge>
                        </v-card>
                    </v-col>
                    <!-- Title Editor -->
                    <v-col v-if="titleState" :cols="inputWidth">
                        <v-card flat color="transparent" width="100%" class="mx-auto">
                            <v-card-title>
                                <v-text-field
                                    v-model="blogPostTitle"
                                    @keydown="handleKeyDown"
                                    autofocus
                                    hint="You can press enter to save!"
                                    class="interactive-title"
                                    variant="solo">
                                    <template #append-inner>
                                        <v-icon>mdi-keyboard-return</v-icon>
                                    </template>
                                    <template #append>
                                        <v-btn
                                            :rounded="false"
                                            variant="elevated"
                                            color="success"
                                            size="small"
                                            @click="titleState = false">
                                            <template #default>
                                                <v-icon> mdi-check </v-icon>
                                            </template>
                                        </v-btn>
                                    </template>
                                </v-text-field>
                            </v-card-title>
                        </v-card>
                    </v-col>
                    <v-col :cols="inputWidth">
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
                                variant="solo"
                                hide-details />
                        </v-card>
                    </v-col>

                    <v-col :cols="12">
                        <MdEditor
                            v-model="blogPostBody"
                            @onSave="saveContentToLocalStorage"
                            :theme="isDark ? 'dark' : 'light'"
                            :preview-theme="previewThemePreference"
                            :tab-width="4"
                            :table-shape="tableShape"
                            :toolbars="toolbarItems"
                            :read-only="props.readonly"
                            ref="editorRef"
                            language="en-US"
                            no-prettier
                            no-upload-img
                            show-code-row-number
                            class="page-title" />
                    </v-col>
                </v-row>

                <!-- SAVE/CANCEL -->
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

            <!-- SNACKBAR INDICATOR -->
            <v-snackbar
                v-model="snackbar.visible"
                :timeout="snackbar.timeout"
                :color="snackbar.color">
                <div class="text-center">
                    {{ snackbar.text }}
                </div>
            </v-snackbar>
        </v-col>
    </v-row>
</template>
<script setup lang="ts">
import { useRouter, Router } from "vue-router";
import { ref, computed, reactive, watch, onMounted } from "vue";
import { ThemeInstance, useTheme, useDisplay, DisplayInstance } from "vuetify";
import { lineNumbers } from "@codemirror/view";
import { MdEditor, config } from "md-editor-v3";
import sanitizeHtml from "sanitize-html";
import BlogServices from "@/services/BlogServices";
import screenfull from "screenfull";
import katex from "katex";
import mermaid from "mermaid";
import Cropper from "cropperjs";
import highlight from "highlight.js";
import type { ExposeParam, ToolbarNames } from "md-editor-v3";

import { sessionStore } from "@/store/SessionStore";
import { Snackbar } from "@/models/Snackbar";
import { Badge } from "@/models/Badge";

import "highlight.js/styles/github.css";
import "cropperjs/dist/cropper.css";
import "md-editor-v3/lib/style.css";
import "katex/dist/katex.min.css";
import { indexOf } from "lodash-es";

interface PreviewTheme {
    text: string;
    value: string;
}
interface Props {
    readonly: boolean;
    blogId: string;
}

const props = defineProps<Props>();
const sanitize = (html: string): string => sanitizeHtml(html);

const theme: ThemeInstance = useTheme();
const router: Router = useRouter();
const display: DisplayInstance = useDisplay();
const sessStore = sessionStore();

const blogPostBody = ref("# Write your post here.");
const blogPostTitle = ref<string>("A Good Blog Post Title");

const snackbar = reactive<Snackbar>({
    color: "success",
    visible: false,
    timeout: 3000,
    text: "",
});

const editBadge = reactive<Badge>({
    visible: true,
    color: "accent",
    icon: "mdi-pencil",
});

const toolbarItems = reactive<ToolbarNames[]>([
    "save",
    "bold",
    "underline",
    "italic",
    "-",
    "title",
    "strikeThrough",
    "sub",
    "sup",
    "quote",
    "unorderedList",
    "task",
    "-",
    "codeRow",
    "code",
    "link",
    "image",
    "table",
    "mermaid",
    "katex",
]);

const tableShape = reactive<number[]>([8, 4]);
const previewThemePreference = ref<string>("default");
const titleState = ref<boolean>(false);
const editorRef = ref<ExposeParam>();
const mermaidConfig = {
    startOnLoad: true,
    securityLevel: "strict",
};

const previewTheme = reactive<PreviewTheme[]>([
    { text: "Default", value: "default" },
    { text: "GitHub", value: "github" },
    { text: "MKCute", value: "mk-cute" },
    { text: "Cyanosis", value: "cyanosis" },
]);

const inputWidth = computed<number>(() => {
    switch (display.name.value) {
        case "xs":
            return 10;
        case "sm":
            return 8;
        case "md":
            return 6;
        case "lg":
            return 4;
        case "xl":
            return 4;
        case "xxl":
            return 4;
        default:
            return 6;
    }
});

const editorWidth = computed<number>(() => {
    switch (display.name.value) {
        case "xs":
            return 12;
        case "sm":
            return 11;
        case "md":
            return 10;
        case "lg":
            return 10;
        default:
            return 10;
    }
});

const darkState = computed<string>(() => {
    return theme.global.name.value;
});

const isDark = computed<boolean>(() => {
    return darkState.value === "customDarkTheme";
});

const accountId = computed<string>(() => {
    return sessStore.accountID;
});

// MDEditor configuration.
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
// Mermaid Initialization
mermaid.initialize(mermaidConfig);

// Display breakpoint watcher
watch(
    display.name,
    (newVal) => {
        switch (newVal) {
            case "xs":
                editorRef.value?.togglePreview(false);
                if (toolbarItems.indexOf("sub") >= 0) {
                    toolbarItems.splice(toolbarItems.indexOf("sub"), 1);
                }
                if (toolbarItems.indexOf("sup") >= 0) {
                    toolbarItems.splice(toolbarItems.indexOf("sup"), 1);
                }
                if (toolbarItems.indexOf("preview") < 0) {
                    toolbarItems.push("preview");
                }
                break;
            case "sm":
                editorRef.value?.togglePreview(false);
                if (toolbarItems.indexOf("sub") >= 0) {
                    toolbarItems.splice(toolbarItems.indexOf("sub"), 1);
                }
                if (toolbarItems.indexOf("sup") >= 0) {
                    toolbarItems.splice(toolbarItems.indexOf("sup"), 1);
                }
                if (toolbarItems.indexOf("preview") < 0) {
                    toolbarItems.push("preview");
                }
                break;
            case "md":
                editorRef.value?.togglePreview(true);
                if (toolbarItems.indexOf("sub") < 0) {
                    toolbarItems.push("sub");
                }
                if (toolbarItems.indexOf("preview") >= 0) {
                    toolbarItems.splice(toolbarItems.indexOf("preview"), 1);
                }
                break;
            case "lg":
                editorRef.value?.togglePreview(true);
                if (toolbarItems.indexOf("sub") < 0) {
                    toolbarItems.push("sub");
                }
                break;
            case "xl":
                editorRef.value?.togglePreview(true);
                if (toolbarItems.indexOf("sub") < 0) {
                    toolbarItems.push("sub");
                }
                if (toolbarItems.indexOf("sup") < 0) {
                    toolbarItems.push("sup");
                }
                break;
            case "xxl":
                editorRef.value?.togglePreview(true);
                if (toolbarItems.indexOf("sub") < 0) {
                    toolbarItems.push("sub");
                }
                break;
            default:
                editorRef.value?.togglePreview(true);
                break;
        }
    },
    { immediate: true },
);

/**
 * Sanitizes the user input to protect
 * @param code
 */
function sanitizeCode(code: string): void {
    blogPostBody.value = sanitize(code);
}

/**
 * Saves content in editor to local storage
 * @param saveContent
 */
const saveContentToLocalStorage = (saveContent: string) => {
    window.localStorage.setItem("blog_content", saveContent);
    window.localStorage.setItem("blog_title", blogPostTitle.value);

    snackbar.text = "Local Save Successful 💾";
    snackbar.visible = true;
};

/**
 * Handles the keydown event, specifically
 * the enter event. When this happens, the
 * text-field to edit the blog post title is
 * hidden.
 * @param {KeyboardEvent} e
 */
function handleKeyDown(e: KeyboardEvent): void {
    if (e.code === "Enter") {
        titleState.value = false;
    }
}

/**
 * Makes a request to the server to create
 * a blog post using the service layer.
 *
 * Sanitizes the data before sending it to the server.
 */
async function createBlogPost() {
    sanitizeCode(blogPostBody.value);
    BlogServices.createBlogPost(blogPostTitle.value, blogPostBody.value, accountId.value)
        .then(() => {
            window.localStorage.removeItem("blog_content");
            window.localStorage.removeItem("blog_title");
            router.push({ name: "UserBlogPosts" });
        })
        .catch((err) => {
            console.error(err);
        });
}

async function fetchBlogById() {
    BlogServices.fetchBlogById(props.blogId!)
        .then((res) => {
            console.log(res);
            blogPostTitle.value = res.data.data.blog_title;
            blogPostBody.value = res.data.data.blog_post;
        })
        .catch((err) => {
            console.error(err);
        });
}

onMounted(() => {
    if (props.blogId && props.readonly) {
        fetchBlogById();
    }

    if (!props.blogId && !props.readonly) {
        const savedContent: string | null = window.localStorage.getItem("blog_content");
        const savedTitle: string | null = window.localStorage.getItem("blog_title");

        if (savedContent) {
            blogPostBody.value = savedContent;
        }

        if (savedTitle) {
            blogPostTitle.value = savedTitle;
        }
    }
});
</script>
<style>
.interactive-title {
    font-family: "Prata", "serif";
    font-size: x-large;
}
.default-theme h1,
h2,
h3,
h4,
h5,
h6 {
    margin: 0 !important;
}
.page-title {
    font-family: "Prata", "serif";
}
</style>
