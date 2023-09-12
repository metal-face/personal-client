<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import { useTheme, ThemeInstance } from "vuetify";
import { RouteParamsRaw, Router, useRouter } from "vue-router";
import { Snackbar } from "@/models/Snackbar";
import { sessionStore } from "@/store/SessionStore";
import MarkdownEditor from "@/components/blogs/MarkdownEditor.vue";
import BlogServices from "@/services/BlogServices";

interface Props {
    blogId: string;
    readonly: string;
}

const props = defineProps<Props>();
const router: Router = useRouter();
const theme: ThemeInstance = useTheme();
const sessStore = sessionStore();

const snackbar = reactive<Snackbar>({
    visible: false,
    color: "success",
    timeout: 3000,
    text: "",
});

const blogPostTitle = ref<string>("");
const blogPostBody = ref<string>("");

const darkState = computed<string>(() => {
    return theme.global.name.value;
});
const isDark = computed<boolean>(() => {
    return darkState.value === "customDarkTheme";
});

const accountId = computed<string>(() => {
    return sessStore.accountID;
});

const sessionId = computed<string>(() => {
    return sessStore.getSessionId;
});

function redirectUser(name: string, params?: RouteParamsRaw): void {
    router.push({ name: name, params: params });
}

function fetchBlogPostById(): void {
    BlogServices.fetchBlogById(props.blogId).then((res) => {
        if (res.data.data.blog_post) {
            blogPostBody.value = res.data.data.blog_post;
        }
        if (res.data.data.blog_title) {
            blogPostTitle.value = res.data.data.blog_title;
        }
    });
}

function handleTitleChange(change: string): void {
    blogPostTitle.value = change;
}
function handleBodyChange(change: string): void {
    blogPostBody.value = change;
}

function showSnackbar(): void {
    snackbar.visible = true;
    snackbar.color = "success";
    snackbar.text = "Saved to your browser! 💾";
}

function updateBlogById() {
    BlogServices.updateBlogById(
        props.blogId,
        accountId.value,
        sessionId.value,
        blogPostTitle.value,
        blogPostBody.value,
    )
        .then(() => {
            router.push({ name: "BlogPosts" });
        })
        .catch((err) => {
            console.error(err);
        });
}

onMounted(() => {
    if (props.blogId) {
        fetchBlogPostById();
    }
});
</script>

<template>
    <v-row>
        <v-col cols="12">
            <v-snackbar
                v-model="snackbar.visible"
                :timeout="snackbar.timeout"
                :color="snackbar.color"
                location="top"
                variant="elevated">
                <h3 class="text-center">{{ snackbar.text }}</h3>
            </v-snackbar>
            <v-card flat variant="elevated" elevation="12" :color="isDark ? 'black' : 'white'">
                <MarkdownEditor
                    @title:change="handleTitleChange"
                    @body:change="handleBodyChange"
                    @save:local="showSnackbar"
                    :readonly="props.readonly"
                    :blogId="props.blogId" />
                <v-card-actions class="d-flex flex-column mx-auto">
                    <v-btn
                        @click="updateBlogById"
                        variant="elevated"
                        color="accent"
                        block
                        size="x-large"
                        rounded="1"
                        class="mx-auto">
                        Save
                    </v-btn>
                    <v-btn
                        @click="redirectUser('BlogPosts')"
                        variant="elevated"
                        block
                        size="x-large"
                        rounded="1"
                        class="mx-auto">
                        Cancel
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-col>
    </v-row>
</template>
