<script setup lang="ts">
import { ThemeInstance, useTheme } from "vuetify";
import { computed, reactive, onMounted } from "vue";
import { sessionStore } from "@/store/SessionStore";
import { Session } from "@/models/Session";
import BlogServices from "@/services/BlogServices";

interface Blog {
    blogTitle: string;
    blogPost: string;
    accountId: string;
}

onMounted(() => {
    fetchAllBlogsForUser();
});

const theme: ThemeInstance = useTheme();

const rawStorageSession = window.localStorage.getItem("session");

// TODO: add !rawStorageSession redirect to the login

const session = JSON.parse(rawStorageSession!) as Session;

const isDark = computed<boolean>(() => {
    return theme.global.current.value.dark;
});

const blogs: Blog[] = reactive([]);

async function fetchAllBlogsForUser() {
    BlogServices.fetchManyBlogs(session.account_id)
        .then((res) => {
            console.log(res);
        })
        .catch((err) => {
            console.error(err);
        });
}
</script>
<style scoped>
.page-title {
    font-family: "Prata", "serif";
}
</style>
<template>
    <v-card elevation="12" variant="elevated" color="primary" rounded="1" class="fill-height">
        <!-- TODO: list all blogs for the signed in user -->
        <!-- TODO: if there are no blogs, diplay an indicator to create a blog. -->
        <!-- TODO: add a create button that redirects the user to the create page. -->
        <v-card variant="flat" color="primary" rounded="1">
            <v-card-title class="page-title text-center ma-3">
                <h1 class="text-decoration-underline">Blog Posts</h1>
            </v-card-title>
        </v-card>
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
</template>
