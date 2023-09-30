<script setup lang="ts">
import { DisplayInstance, ThemeInstance, useDisplay, useTheme } from "vuetify";
import { computed, reactive, onMounted, ref, nextTick, Ref, ComputedRef } from "vue";
import { Session } from "@/models/Session";
import { format } from "date-fns";
import { ConfirmDeleteState } from "@/models/ConfirmDeleteState";
import { sessionStore } from "@/store/SessionStore";
import { Blog } from "@/models/Blog";
import BlogServices from "@/services/BlogServices";
import ConfirmDelete from "@/components/utils/ConfirmDelete.vue";
import CircleLoader from "@/components/utils/CircleLoader.vue";
import EmptyBlogPostIndicator from "@/components/blogs/EmptyBlogPostIndicator.vue";
import PersonalBlogCard from "@/components/blogs/PersonalBlogCard.vue";
import Pagination from "@/components/utils/Pagination.vue";

onMounted(() => {
    fetchAllBlogsForUser();
});

const theme: ThemeInstance = useTheme();
const display: DisplayInstance = useDisplay();
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

const colCount: Ref<number> = ref<number>(6);

const isMobile: Ref<boolean> = ref<boolean>(false);

const totalServerBlogs: Ref<number> = ref<number>(0);

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

function onResize(): void {
    switch (display.name.value) {
        case "xs":
            colCount.value = 12;
            if (isMobile.value) {
                break;
            }
            isMobile.value = true;
            break;
        case "sm":
            colCount.value = 10;
            if (!isMobile.value) {
                break;
            }
            isMobile.value = false;
            break;
        case "md":
            colCount.value = 6;
            break;
        case "lg":
            colCount.value = 4;
            break;
        case "xl":
            colCount.value = 4;
            break;
        default:
            isMobile.value = false;
            colCount.value = 6;
            break;
    }
}

async function fetchAllBlogsForUser(): Promise<void> {
    loading.value = true;
    BlogServices.fetchManyBlogs(session.account_id)
        .then((res) => {
            blogs.splice(0, blogs.length);
            blogs.push(...res.data.data);
            totalServerBlogs.value = res.data.meta.total;
        })
        .finally(() => {
            loading.value = false;
        })
        .catch((err) => {
            console.error(err);
        });
}

async function fetchPage(page: number): Promise<void> {
    loading.value = true;
    BlogServices.fetchManyBlogs(session.account_id, page)
        .then((res) => {
            blogs.splice(0, blogs.length);
            blogs.push(...(res.data.data as Blog[]));
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
    <v-row v-resize="onResize" class="fill-height">
        <v-col cols="12">
            <CircleLoader :loading="loading" circle-color="accent" />
            <ConfirmDelete
                @confirm:delete="deleteBlogPostById"
                @confirm:cancel="closeConfirmDelete"
                :visible="confirmDeleteState.visible"
                :resourceId="confirmDeleteState.idToDelete" />
            <v-card variant="flat" color="transparent" rounded="1" class="fill-height mb-12">
                <v-card-title class="page-title text-center ma-3">
                    <h1 class="text-decoration-underline">Blog Posts</h1>
                </v-card-title>
                <v-tooltip text="Create Post" location="left">
                    <template #activator="{ props }">
                        <v-btn
                            v-bind="props"
                            :to="{ name: 'BlogCreator' }"
                            :color="isDark ? 'accent' : 'black'"
                            :position="isMobile ? 'relative' : 'fixed'"
                            :location="isMobile ? 'top center' : 'bottom right'"
                            :rounded="isMobile ? '1' : '10'"
                            :icon="isMobile ? false : 'mdi-plus'"
                            :class="isMobile ? 'ma-0' : 'mr-4 mb-4'"
                            :density="isMobile ? 'compact' : 'default'"
                            variant="elevated"
                            size="x-large">
                            <template #default>
                                <div v-if="isMobile">Create</div>
                                <div v-else><v-icon icon="mdi-plus"></v-icon></div>
                            </template>
                        </v-btn>
                    </template>
                </v-tooltip>
                <v-row justify="center">
                    <v-col v-if="!blogs.length" :cols="colCount">
                        <EmptyBlogPostIndicator class="page-title" text="You have no blogs!" />
                    </v-col>
                    <v-col v-if="blogs.length > 0" :cols="colCount">
                        <div class="bg-transparent pa-2 ma-2">
                            <PersonalBlogCard
                                @delete:confirm="openConfirmDelete"
                                v-for="(blog, i) in blogs"
                                :key="i"
                                :blogId="blog.blog_id"
                                :creation-date="humanReadableData(blog.created_at)"
                                :blog-post="blog.blog_post"
                                :blog-title="blog.blog_title" />
                        </div>
                    </v-col>
                </v-row>
            </v-card>
            <v-card flat class="mt-12" position="absolute" color="transparent" location="bottom">
                <Pagination
                    @update:change="fetchPage"
                    @prev="fetchPage"
                    @next="fetchPage"
                    :totalCount="totalServerBlogs" />
            </v-card>
        </v-col>
    </v-row>
</template>
<style scoped>
.page-title {
    font-family: "Prata", "serif";
}
</style>
