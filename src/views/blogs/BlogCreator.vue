<template>
    <v-row class="fill-height" justify="center" align="center" dense no-gutters>
        <v-col :cols="editorWidth">
            <v-card
                :elevation="isDark ? 0 : 12"
                :variant="isDark ? 'flat' : 'elevated'"
                class="fill-height"
                color="background">
                <MarkdownEditor @body:change="handleBodyChange" @title:change="handleTitleChange" />

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
import { sessionStore } from "@/store/SessionStore";
import { Snackbar } from "@/models/Snackbar";
import sanitizeHtml from "sanitize-html";
import BlogServices from "@/services/BlogServices";
import MarkdownEditor from "@/components/blogs/MarkdownEditor.vue";

const sanitize = (html: string): string => sanitizeHtml(html);

const theme: ThemeInstance = useTheme();
const router: Router = useRouter();
const display: DisplayInstance = useDisplay();

const sessStore = sessionStore();
const accountId = computed<string>(() => {
    return sessStore.accountID;
});

const blogPostBody = ref("# Write your post here.");
const blogPostTitle = ref<string>("A Good Blog Post Title");

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
