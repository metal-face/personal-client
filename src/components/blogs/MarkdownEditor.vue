<script setup lang="ts">
import { config, ExposeParam, MdEditor, ToolbarNames, NormalToolbar } from "md-editor-v3";
import { computed, reactive, ref, watch, defineEmits, onMounted } from "vue";
import { DisplayInstance, ThemeInstance, useDisplay, useTheme } from "vuetify";
import { Badge } from "@/models/Badge";
import { lineNumbers } from "@codemirror/view";
import mermaid from "mermaid";
import screenfull from "screenfull";
import highlight from "highlight.js";
import katex from "katex";
import Cropper from "cropperjs";
import "highlight.js/styles/github.css";
import "cropperjs/dist/cropper.css";
import "md-editor-v3/lib/style.css";
import "katex/dist/katex.min.css";
import BlogServices from "@/services/BlogServices";

interface Props {
    readonly?: string;
    blogId?: string;
}

interface PreviewTheme {
    text: string;
    value: string;
}

const emit = defineEmits<{
    (e: "title:change", title: string): void;
    (e: "body:change", title: string): void;
    (e: "save:local"): void;
}>();

const props = defineProps<Props>();

const theme: ThemeInstance = useTheme();
const display: DisplayInstance = useDisplay();

const blogPostBody = ref("# Write your post here.");
const blogPostTitle = ref<string>("A Good Blog Post Title");

const previewThemePreference = ref<string>("default");
const tableShape = reactive<number[]>([8, 4]);
const editorRef = ref<ExposeParam>();

const previewTheme = reactive<PreviewTheme[]>([
    { text: "Default", value: "default" },
    { text: "GitHub", value: "github" },
    { text: "MKCute", value: "mk-cute" },
    { text: "Cyanosis", value: "cyanosis" },
]);

const readonlyProp = computed<boolean>(() => {
    return props.readonly === "true";
});

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

const darkState = computed<string>(() => {
    return theme.global.name.value;
});

const isDark = computed<boolean>(() => {
    return darkState.value === "customDarkTheme";
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

const titleState = ref<boolean>(false);
const editBadge = reactive<Badge>({
    visible: true,
    color: "accent",
    icon: "mdi-pencil",
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
    codeMirrorExtensions(_theme: any, extensions: any) {
        return [...extensions, lineNumbers()];
    },
});

const mermaidConfig = {
    startOnLoad: true,
    securityLevel: "strict",
};
// Mermaid Initialization
mermaid.initialize(mermaidConfig);

// Display breakpoint watcher
watch(
    display.name,
    (newVal: any) => {
        switch (newVal) {
            case "xs":
                editorRef.value?.togglePreview(false);
                if (toolbarItems.indexOf("sub") >= 0) {
                    toolbarItems.splice(toolbarItems.indexOf("sub"), 1);
                }
                if (toolbarItems.indexOf("sup") >= 0) {
                    toolbarItems.splice(toolbarItems.indexOf("sup"), 1);
                }
                if (toolbarItems.indexOf("preview") < 0 && !readonlyProp.value) {
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
                if (toolbarItems.indexOf("preview") < 0 && !readonlyProp.value) {
                    toolbarItems.push("preview");
                }
                break;
            case "md":
                editorRef.value?.togglePreview(true);
                if (toolbarItems.indexOf("sub") < 0 && !readonlyProp.value) {
                    toolbarItems.push("sub");
                }
                if (toolbarItems.indexOf("preview") >= 0) {
                    toolbarItems.splice(toolbarItems.indexOf("preview"), 1);
                }
                break;
            case "lg":
                editorRef.value?.togglePreview(true);
                if (toolbarItems.indexOf("sub") < 0 && !readonlyProp.value) {
                    toolbarItems.push("sub");
                }
                break;
            case "xl":
                editorRef.value?.togglePreview(true);
                if (toolbarItems.indexOf("sub") < 0 && !readonlyProp.value) {
                    toolbarItems.push("sub");
                }
                if (toolbarItems.indexOf("sup") < 0 && !readonlyProp.value) {
                    toolbarItems.push("sup");
                }
                break;
            case "xxl":
                editorRef.value?.togglePreview(true);
                if (toolbarItems.indexOf("sub") < 0 && !readonlyProp.value) {
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

watch(blogPostTitle, () => {
    emit("title:change", blogPostTitle.value);
});

watch(blogPostBody, () => {
    emit("body:change", blogPostBody.value);
});

/**
 * Saves content in editor to local storage
 * @param saveContent
 */
const saveContentToLocalStorage = (saveContent: string) => {
    window.localStorage.setItem("blog_content", saveContent);
    window.localStorage.setItem("blog_title", blogPostTitle.value);

    emit("save:local");
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

async function fetchBlogById() {
    if (!props.blogId) return;
    BlogServices.fetchBlogById(props.blogId)
        .then((res) => {
            blogPostTitle.value = res.data.data.blog_title;
            blogPostBody.value = res.data.data.blog_post;
        })
        .catch((err) => {
            console.error(err);
        });
}

onMounted(() => {
    if (readonlyProp.value) {
        toolbarItems.splice(0, toolbarItems.length);
    }
    if (props.blogId) {
        fetchBlogById();
    }
});
</script>

<template>
    <v-row justify="center" align-content="center">
        <!-- Actual Title -->
        <v-col v-if="!titleState" :cols="12">
            <v-card v-if="readonlyProp === true" flat height="100%" color="transparent">
                <v-card-title class="text-center page-title">
                    <h1>{{ blogPostTitle }}</h1>
                </v-card-title>
            </v-card>
            <v-card
                v-if="readonlyProp === false"
                @click="titleState = true"
                flat
                height="100%"
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
                    <v-card-title class="ma-3 pa-3">
                        <h1 class="page-title">{{ blogPostTitle }}</h1>
                    </v-card-title>
                </v-badge>
            </v-card>
        </v-col>
        <!-- Title Editor -->
        <v-col v-if="titleState" :cols="12">
            <v-row justify="center" align-content="center">
                <v-col :cols="inputWidth">
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
            </v-row>
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
                :read-only="readonlyProp"
                ref="editorRef"
                language="en-US"
                no-prettier
                no-upload-img
                show-code-row-number
                class="page-title">
                <template #defToolbars>
                    <NormalToolbar v-if="!readonlyProp" />
                </template>
            </MdEditor>
        </v-col>
    </v-row>
</template>

<style scoped>
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
