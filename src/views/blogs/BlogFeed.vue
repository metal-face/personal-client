<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { Blogs } from "@/models/Blogs";
import { DisplayInstance, ThemeInstance, useDisplay, useTheme } from "vuetify";
import { format } from "date-fns";
import BlogServices from "@/services/BlogServices";
import GeneralBlogCard from "@/components/blogs/GeneralBlogCard.vue";
import CircleLoader from "@/components/utils/CircleLoader.vue";
import EmptyBlogPostIndicator from "@/components/blogs/EmptyBlogPostIndicator.vue";

const theme: ThemeInstance = useTheme();
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
                <v-row justify="center">
                    <v-col v-if="!blogPosts.blogs.length" :cols="colCount">
                        <EmptyBlogPostIndicator
                            text="There have been no blogs written by any users." />
                    </v-col>
                    <v-col v-if="blogPosts.blogs.length > 0" :cols="colCount" class="fill-height">
                        <GeneralBlogCard
                            v-for="blog in blogPosts.blogs"
                            :key="blog.blog_id"
                            :blogId="blog.blog_id"
                            :blogPostTitle="blog.blog_title"
                            :blogCreationDate="humanReadableDate(blog.created_at)" />
                    </v-col>
                </v-row>
            </v-card>
        </v-col>
    </v-row>
</template>

<style scoped>
.page-title {
    font-family: "Prata", "serif";
}
</style>
