<script setup lang="ts">
import { reactive, Ref, ref, onMounted, computed } from "vue";
import { Router, useRouter } from "vue-router";
import { useTheme, ThemeInstance, useDisplay, DisplayInstance } from "vuetify";
import { MdPreview, MdCatalog, config } from "md-editor-v3";
import { lineNumbers } from "@codemirror/view";
import BlogServices from "@/services/BlogServices";
import mermaid from "mermaid";
import highlight from "highlight.js";
import Cropper from "cropperjs";
import "highlight.js/styles/github.css";
import "cropperjs/dist/cropper.css";
import "md-editor-v3/lib/style.css";

const router: Router = useRouter();
const theme: ThemeInstance = useTheme();

interface Blog {
    blogPostTitle: Ref<string>;
    blogPostBody: Ref<string>;
}

interface Props {
    blogId?: string;
    readonly?: string;
}

const display: DisplayInstance = useDisplay();

const blog = reactive<Blog>({
    blogPostBody: ref<string>(""),
    blogPostTitle: ref<string>(""),
});

const darkState = computed<string>(() => {
    return theme.global.name.value;
});
const isDark = computed<boolean>(() => {
    return darkState.value === "customDarkTheme";
});

const props = withDefaults(defineProps<Props>(), {
    blogId: "",
    readonly: "true",
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

const scrollElement = document.documentElement;
const id: string = "mdEditor";

const isMobile: Ref<boolean> = ref<boolean>(false);

async function fetchBlogById() {
    BlogServices.fetchBlogById(props.blogId)
        .then((res) => {
            blog.blogPostTitle = res.data.data.blog_title;
            blog.blogPostBody = res.data.data.blog_post;
        })
        .catch((err) => {
            console.error(err);
        });
}

function handleResize(): void {
    switch (display.name.value) {
        case "xs":
            isMobile.value = true;
            break;
        case "sm":
            isMobile.value = false;
            break;
        default:
            isMobile.value = false;
            break;
    }
}

// MDEditor configuration.
config({
    editorExtensions: {
        highlight: {
            instance: highlight,
        },
        mermaid: {
            instance: mermaid,
        },
        cropper: {
            instance: Cropper,
        },
    },
    codeMirrorExtensions(_theme: any, extensions: any) {
        return [...extensions, lineNumbers()];
    },
});

onMounted(async () => {
    if (!props.blogId) return;
    await fetchBlogById();
});
</script>

<template>
    <v-row v-resize="handleResize" justify="center">
        <v-col :cols="editorWidth">
            <v-card color="transparent" variant="elevated" elevation="4" width="100%" height="100%">
                <v-card-title class="ma-2 editor text-center">
                    <h1 v-if="!isMobile" class="ma-2">
                        {{ blog.blogPostTitle }}
                    </h1>
                    <h3 v-if="isMobile" class="ma-2">{{ blog.blogPostTitle }}</h3>
                </v-card-title>
                <MdPreview
                    :modelValue="blog.blogPostBody"
                    :id="id"
                    :theme="isDark ? 'dark' : 'light'"
                    class="editor"
                    show-code-row-number />
                <MdCatalog
                    :id="id"
                    :theme="isDark ? 'dark' : 'light'"
                    :scrollElement="scrollElement" />
            </v-card>
        </v-col>
        <v-tooltip location="top">
            <template #activator="{ props }">
                <v-btn
                    @click="router.back()"
                    :color="isDark ? 'accent' : 'black'"
                    v-bind="props"
                    position="fixed"
                    location="bottom right"
                    variant="elevated"
                    rounded="5"
                    class="mr-4 mb-4"
                    icon="mdi-arrow-left"
                    size="x-large">
                </v-btn>
            </template>
            <span>Go Back</span>
        </v-tooltip>
    </v-row>
</template>

<style scoped>
.editor {
    font-family: "Prata", "serif";
}
</style>
