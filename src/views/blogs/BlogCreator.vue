<template>
    <v-row class="fill-height" justify="center" align="center" dense no-gutters>
        <v-col :cols="editorWidth">
            <v-card
                :elevation="isDark ? 0 : 12"
                :variant="isDark ? 'flat' : 'elevated'"
                class="fill-height"
                color="background">
                <MarkdownEditor
                    @save:local="handleLocalSave"
                    @body:change="handleBodyChange"
                    @title:change="handleTitleChange" />

                <!-- SAVE/CANCEL -->
                <v-card-actions class="d-flex flex-column ma-0 pa-0">
                    <v-btn
                        @click="createBlogPost"
                        :disabled="dirty"
                        :color="isDark ? 'accent' : 'black'"
                        class="ma-0 pa-0"
                        rounded="0"
                        size="x-large"
                        variant="flat"
                        block>
                        Save
                    </v-btn>
                    <v-btn
                        @click="router.push({ name: 'BlogPosts' })"
                        color="primary"
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
import { ref, computed, reactive, onMounted, Ref, ComputedRef, defineAsyncComponent } from "vue";
import { ThemeInstance, useTheme, useDisplay, DisplayInstance } from "vuetify";
import { sessionStore } from "@/store/SessionStore";
import { Snackbar } from "@/models/Snackbar";
import sanitizeHtml from "sanitize-html";
import BlogServices from "@/services/BlogServices";

const MarkdownEditor = defineAsyncComponent(() => import("@/components/blogs/MarkdownEditor.vue"));

const sanitize = (html: string): string => sanitizeHtml(html);

const theme: ThemeInstance = useTheme();
const router: Router = useRouter();
const display: DisplayInstance = useDisplay();

const sessStore = sessionStore();
const accountId = computed<string>(() => {
    return sessStore.accountID;
});

const dirty: ComputedRef<boolean> = computed<boolean>(() => {
    return (
        blogPostBody.value.length < 100 ||
        blogPostBody.value.length > 200000 ||
        blogPostTitle.value.length < 5 ||
        blogPostTitle.value.length > 100
    );
});

const sessionId = computed<string>(() => {
    return sessStore.getSessionId;
});

const blogPostBody: Ref<string> = ref<string>("# Write your post here.");
const blogPostTitle: Ref<string> = ref<string>("A Good Blog Post Title");

const snackbar = reactive<Snackbar>({
    color: "success",
    visible: false,
    timeout: 3000,
    text: "",
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

function handleLocalSave(): void {
    snackbar.visible = true;
    snackbar.text = "Saved locally 💾";
    snackbar.color = "success";
    snackbar.timeout = 3000;
}

/**
 * When the body:change event is heard,
 * this method is used to save the payloads
 * contents to the blogPostBody variable in
 * this component.
 */
function handleBodyChange(payload: string): void {
    blogPostBody.value = payload;
}

/**
 * When the title:change event is heard,
 * this method is used to save the contents
 * of that payload to the blogPostTitle variable
 * in this component.
 */
function handleTitleChange(payload: string): void {
    blogPostTitle.value = payload;
}

/**
 * Sanitizes the user input to protect
 * @param code
 */
function sanitizeCode(code: string): void {
    blogPostBody.value = sanitize(code);
}

/**
 * Makes a request to the server to create
 * a blog post using the service layer.
 *
 * Sanitizes the data before sending it to the server.
 */
async function createBlogPost() {
    if (blogPostBody.value.length < 100 || blogPostBody.value.length > 200000) {
        return;
    }

    if (blogPostTitle.value.length < 5 || blogPostTitle.value.length > 100) {
        return;
    }
    sanitizeCode(blogPostBody.value);
    BlogServices.createBlogPost(
        blogPostTitle.value,
        blogPostBody.value,
        accountId.value,
        sessionId.value,
    )
        .then(() => {
            window.localStorage.removeItem("blog_content");
            window.localStorage.removeItem("blog_title");
            router.push({ name: "BlogPosts" });
        })
        .catch((err) => {
            console.error(err);
        });
}

onMounted(() => {
    const savedContent: string | null = window.localStorage.getItem("blog_content");
    const savedTitle: string | null = window.localStorage.getItem("blog_title");

    if (savedContent) {
        blogPostBody.value = savedContent;
    }

    if (savedTitle) {
        blogPostTitle.value = savedTitle;
    }
});
</script>
