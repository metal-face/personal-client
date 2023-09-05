<script setup lang="ts">
import BlogServices from "@/services/BlogServices";
import { computed, onMounted, reactive, ref } from "vue";
import { Blogs } from "@/models/Blogs";
import { ThemeInstance, useTheme } from "vuetify";
import { format } from "date-fns";
import { useRouter, Router } from "vue-router";
import GeneralBlogCard from "@/components/blogs/GeneralBlogCard.vue";

const theme: ThemeInstance = useTheme();
const router: Router = useRouter();

const blogPosts = ref<Blogs>({ blogs: [] });

const isDark = computed<boolean>(() => {
    return theme.current.value.dark;
});

function humanReadableDate(rawString: string): string {
    console.log(rawString);
    const rawDate: Date = new Date(rawString);
    return format(rawDate, "PPPP");
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
    await fetchManyBlogs();
});
</script>

<template>
    <v-row class="fill-height">
        <v-col cols="12">
            <v-card
                class="fill-height"
                variant="elevated"
                elevation="6"
                :color="isDark ? 'black' : 'white'">
                <v-card-title class="text-center page-title text-decoration-underline">
                    <h1 class="my-5">Your Feed</h1>
                </v-card-title>
                <v-card-text>
                    <v-row>
                        <v-col cols="4" v-for="blog in blogPosts.blogs" :key="blog.blog_id">
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
