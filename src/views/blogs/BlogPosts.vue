<script setup lang="ts">
import { ThemeInstance, useTheme } from "vuetify";
import { computed, reactive, onMounted, ref, nextTick } from "vue";
import { Session } from "@/models/Session";
import { format } from "date-fns";
import { ConfirmDeleteState } from "@/models/ConfirmDeleteState";
import { sessionStore } from "@/store/SessionStore";
import BlogServices from "@/services/BlogServices";
import BlogPostCard from "@/components/blogs/PersonalBlogCard.vue";
import ConfirmDelete from "@/components/utils/ConfirmDelete.vue";
import CircleLoader from "@/components/utils/CircleLoader.vue";

interface Blog {
    blog_title: string;
    blog_post: string;
    account_id: string;
    created_at: string;
    blog_id: string;
}

onMounted(() => {
    fetchAllBlogsForUser();
});

const theme: ThemeInstance = useTheme();
const sessStore = sessionStore();

const rawStorageSession = window.localStorage.getItem("session");

const session = JSON.parse(rawStorageSession!) as Session;

const isDark = computed<boolean>(() => {
    return theme.global.current.value.dark;
});

const sessionId = computed<string>(() => {
    return sessStore.getSessionId;
});

const loading = ref<boolean>(false);

const confirmDeleteState = reactive<ConfirmDeleteState>({
    visible: ref<boolean>(false),
    idToDelete: ref<string>(""),
});

const blogs: Blog[] = reactive([]);

function openConfirmDelete(idToDelete: string): void {
    confirmDeleteState.visible = true;
    confirmDeleteState.idToDelete = idToDelete;
}

function closeConfirmDelete() {
    confirmDeleteState.idToDelete = "";
    confirmDeleteState.visible = false;
}

function humanReadableData(rawString: string): string {
    const rawDate: Date = new Date(rawString);
    return format(rawDate, "PPPP");
}

async function deleteBlogPostById(blogId: string) {
    closeConfirmDelete();

    await nextTick(() => {
        loading.value = true;
        BlogServices.deleteBlogById(blogId, sessionId.value)
            .then(() => {
                loading.value = false;
            })
            .finally(() => {
                fetchAllBlogsForUser();
            })
            .catch((err) => {
                // TODO: snackbar handling
                console.error(err);
            });
    });
}

async function fetchAllBlogsForUser() {
    loading.value = true;
    BlogServices.fetchManyBlogs(session.account_id)
        .then((res) => {
            blogs.splice(0, blogs.length);
            blogs.push(...res.data.data);
        })
        .finally(() => {
            loading.value = false;
        })
        .catch((err) => {
            console.error(err);
        });
}
</script>
<template>
    <v-row class="fill-height">
        <CircleLoader :loading="loading" circle-color="accent" />
        <ConfirmDelete
            @confirm:delete="deleteBlogPostById"
            @confirm:cancel="closeConfirmDelete"
            :visible="confirmDeleteState.visible"
            :resourceId="confirmDeleteState.idToDelete" />
        <v-col cols="12">
            <v-card variant="flat" color="primary" rounded="1" class="fill-height">
                <!-- TODO: if there are no blogs, display an indicator to create a blog. -->
                <v-card-title class="page-title text-center ma-3">
                    <h1 class="text-decoration-underline">Blog Posts</h1>
                </v-card-title>
                <v-row justify="center" align-content="center">
                    <v-col cols="6">
                        <BlogPostCard
                            v-for="(blog, i) in blogs"
                            :key="i"
                            @delete:confirm="openConfirmDelete"
                            :blogId="blog.blog_id"
                            :creation-date="humanReadableData(blog.created_at)"
                            :blog-post="blog.blog_post"
                            :blog-title="blog.blog_title">
                        </BlogPostCard>
                    </v-col>
                </v-row>

                <v-tooltip text="Create Post" location="left">
                    <template #activator="{ props }">
                        <v-btn
                            :to="{ name: 'BlogCreator' }"
                            :color="isDark ? 'white' : 'black'"
                            v-bind="props"
                            position="fixed"
                            location="bottom right"
                            variant="elevated"
                            rounded="10"
                            class="mr-4 mb-4"
                            icon="mdi-plus"
                            size="x-large">
                        </v-btn>
                    </template>
                </v-tooltip>
            </v-card>
        </v-col>
    </v-row>
</template>
<style scoped>
.page-title {
    font-family: "Prata", "serif";
}
</style>
