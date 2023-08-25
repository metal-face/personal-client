<script setup lang="ts">
import { ThemeInstance, useTheme } from "vuetify";
import { computed, reactive, onMounted } from "vue";
import { Session } from "@/models/Session";
import BlogServices from "@/services/BlogServices";
import BlogPostCard from "@/components/blogs/BlogPostCard.vue";
import { format } from "date-fns";
import { useRouter, Router, RouteParamsRaw } from "vue-router";

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
const router: Router = useRouter();

const rawStorageSession = window.localStorage.getItem("session");

// TODO: add !rawStorageSession redirect to the login

const session = JSON.parse(rawStorageSession!) as Session;

const isDark = computed<boolean>(() => {
    return theme.global.current.value.dark;
});

const blogs: Blog[] = reactive([]);

function humanReadableData(rawString: string): string {
    const rawDate: Date = new Date(rawString);
    return format(rawDate, "PPPP");
}

function handleRedirection(name: string, params: object) {
    router.push({ name: name, params: params as RouteParamsRaw });
}

function redirectToReadOnly(blogId: string): void {
    router.push({ name: "BlogCreator", params: { readonly: true, blogId: blogId } });
}

async function fetchAllBlogsForUser() {
    BlogServices.fetchManyBlogs(session.account_id)
        .then((res) => {
            blogs.splice(0, blogs.length);
            blogs.push(...res.data.data);
        })
        .catch((err) => {
            console.error(err);
        });
}
</script>
<template>
    <v-row class="fill-height">
        <v-col cols="12">
            <v-card
                elevation="12"
                variant="elevated"
                color="primary"
                rounded="1"
                class="fill-height">
                <!-- TODO: list all blogs for the signed in user -->
                <!-- TODO: if there are no blogs, diplay an indicator to create a blog. -->
                <!-- TODO: add a create button that redirects the user to the create page. -->
                <v-card-title class="page-title text-center ma-3">
                    <h1 class="text-decoration-underline">Blog Posts</h1>
                </v-card-title>
                <v-row justify="center" align-content="center">
                    <v-col cols="6">
                        <v-card
                            class="ma-2 d-flex justify-space-between align-center"
                            elevation="12"
                            variant="elevated"
                            v-for="(blog, i) in blogs"
                            :key="i">
                            <BlogPostCard
                                :creation-date="humanReadableData(blog.created_at)"
                                :blog-post="blog.blog_post"
                                :blog-title="blog.blog_title" />
                            <v-card-actions class="ma-0 pa-0">
                                <v-btn size="large" class="ma-0" icon="mdi-pencil" color="info" />
                                <v-btn
                                    @click="
                                        handleRedirection('BlogCreator', {
                                            readonly: true,
                                            blogId: blog.blog_id,
                                        })
                                    "
                                    size="large"
                                    class="ma-0"
                                    icon="mdi-eye"
                                    color="yellow" />
                                <v-btn
                                    size="large"
                                    class="ma-0"
                                    icon="mdi-trash-can"
                                    color="error" />
                            </v-card-actions>
                        </v-card>
                    </v-col>
                </v-row>

                <v-tooltip text="Create Post" location="left">
                    <template #activator="{ props }">
                        <v-btn
                            :to="{ name: 'BlogCreator' }"
                            :color="isDark ? 'white' : 'black'"
                            v-bind="props"
                            position="absolute"
                            location="bottom right"
                            variant="elevated"
                            size="x-large"
                            rounded="3"
                            class="ma-3"
                            icon="mdi-pencil">
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
