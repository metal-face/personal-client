<script setup lang="ts">
import BlogServices from "@/services/BlogServices";
import { computed, onMounted, ref } from "vue";
import { Blogs } from "@/models/Blogs";
import { DisplayInstance, ThemeInstance, useDisplay, useTheme } from "vuetify";
import { format } from "date-fns";
import { useRouter, Router } from "vue-router";
import GeneralBlogCard from "@/components/blogs/GeneralBlogCard.vue";
import CircleLoader from "@/components/utils/CircleLoader.vue";

const theme: ThemeInstance = useTheme();
const router: Router = useRouter();
const display: DisplayInstance = useDisplay();

const blogPosts = ref<Blogs>({ blogs: [] });

const loading = ref<boolean>(false);

const colCount = ref<number>(6);

const isDark = computed<boolean>(() => {
    return theme.current.value.dark;
});

function humanReadableDate(rawString: string): string {
    const rawDate: Date = new Date(rawString);
    return format(rawDate, "PPPP");
}

function onResize() {
    switch (display.name.value) {
        case "xs":
            colCount.value = 12;
            break;
        case "sm":
            colCount.value = 8;
            break;
        case "md":
            colCount.value = 6;
            break;
        case "lg":
            colCount.value = 4;
            break;
        case "xl":
            colCount.value = 3;
            break;
        default:
            colCount.value = 6;
    }
}

function handleRedirection(blogId: string): void {
    router.push({ name: "BlogViewer", params: { blogId: blogId, readonly: "true" } });
}

async function fetchManyBlogs() {
    return BlogServices.fetchManyBlogs()
        .then((res) => {
            blogPosts.value.blogs.splice(0, blogPosts.value.blogs.length);
            blogPosts.value.blogs.push(...res.data.data);
        })
        .catch((err) => {
            console.error(err);
        });
}

onMounted(async () => {
    loading.value = true;
    await fetchManyBlogs();
    loading.value = false;
});
</script>

<template>
    <v-row class="fill-height" v-resize="onResize">
        <v-col :cols="12">
            <CircleLoader :loading="loading" circle-color="pink" />
            <v-card class="fill-height" variant="flat" :color="isDark ? 'black' : 'white'">
                <v-card-title class="text-center page-title text-decoration-underline">
                    <h1 class="my-5">Your Feed</h1>
                </v-card-title>
                <v-card-text>
                    <v-row justify="center" align-content="center">
                        <v-col :cols="colCount" v-for="blog in blogPosts.blogs" :key="blog.blog_id">
                            <GeneralBlogCard
                                @click="handleRedirection(blog.blog_id)"
                                :blogPostTitle="blog.blog_title"
                                :blogCreationDate="humanReadableDate(blog.created_at)" />
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>
        </v-col>
    </v-row>
</template>

<style scoped>
.page-title {
    font-family: "Prata", "serif";
}
</style>
