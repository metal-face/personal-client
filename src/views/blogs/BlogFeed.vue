<script setup lang="ts">
import { defineAsyncComponent, onMounted, reactive, Ref, ref } from "vue";
import { DisplayInstance, useDisplay } from "vuetify";
import { format } from "date-fns";
import { Blog } from "@/models/Blog";
import BlogServices from "@/services/BlogServices";

const Pagination = defineAsyncComponent(() => import("@/components/utils/Pagination.vue"));

const EmptyBlogPostIndicator = defineAsyncComponent(
    () => import("@/components/blogs/EmptyBlogPostIndicator.vue"),
);

const CircleLoader = defineAsyncComponent(() => import("@/components/utils/CircleLoader.vue"));

const GeneralBlogCard = defineAsyncComponent(
    () => import("@/components/blogs/GeneralBlogCard.vue"),
);

const display: DisplayInstance = useDisplay();

const blogPosts: Blog[] = reactive<Blog[]>([]);

const totalServerBlogs: Ref<number> = ref<number>(0);

const loading = ref<boolean>(false);

const colCount = ref<number>(6);

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
            colCount.value = 10;
            break;
        case "md":
            colCount.value = 8;
            break;
        case "lg":
            colCount.value = 6;
            break;
        case "xl":
            colCount.value = 6;
            break;
        default:
            colCount.value = 6;
    }
}

async function fetchManyBlogs() {
    return BlogServices.fetchManyBlogs()
        .then((res) => {
            blogPosts.splice(0, blogPosts.length);
            blogPosts.push(...res.data.data);
            totalServerBlogs.value = res.data.meta.total;
        })
        .catch((err) => {
            console.error(err);
        });
}

function handleLoadingState(state: boolean) {
    loading.value = state;
}

async function fetchPage(page: number): Promise<void> {
    loading.value = true;
    BlogServices.fetchManyBlogs(undefined, page)
        .then((res) => {
            blogPosts.splice(0, blogPosts.length);
            blogPosts.push(...(res.data.data as Blog[]));
        })
        .finally(() => {
            loading.value = false;
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
    <v-row v-resize="onResize" class="fill-height">
        <v-col :cols="12">
            <CircleLoader :loading="loading" circle-color="accent" />
            <v-card variant="flat" color="transparent">
                <v-card-title class="text-center page-title text-decoration-underline">
                    <h1 class="my-5">Your Feed</h1>
                </v-card-title>
                <v-card flat color="transparent" height="100%">
                    <v-row justify="center" align-content="center">
                        <v-col v-if="!blogPosts.length" :cols="colCount">
                            <EmptyBlogPostIndicator
                                text="There have been no blogs written by any users." />
                        </v-col>
                        <v-col v-if="blogPosts.length > 0" :cols="colCount">
                            <GeneralBlogCard
                                @loading="handleLoadingState"
                                v-for="blog in blogPosts"
                                :key="blog.blog_id"
                                :account_id="blog.account_id"
                                :blogId="blog.blog_id"
                                :blogPostTitle="blog.blog_title"
                                :blogCreationDate="humanReadableDate(blog.created_at)" />
                        </v-col>
                    </v-row>
                </v-card>
            </v-card>
        </v-col>
        <v-row dense no-gutters>
            <v-col cols="12">
                <v-card flat location="bottom center" color="transparent" class="pa-2 mt-12">
                    <Pagination
                        @update:change="fetchPage"
                        @prev="fetchPage"
                        @click="fetchPage"
                        :blogs="blogPosts"
                        :totalCount="totalServerBlogs" />
                </v-card>
            </v-col>
        </v-row>
    </v-row>
</template>

<style scoped>
.page-title {
    font-family: "Prata", "serif";
}
</style>
