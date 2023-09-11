<script setup lang="ts">
import { computed } from "vue";
import { Router, useRouter } from "vue-router";

interface Props {
    blogId: string;
    blogPostTitle: string;
    blogCreationDate: string;
}

const router: Router = useRouter();

const props = defineProps<Props>();

const blogId = computed<string>(() => {
    return props.blogId;
});

function handleRedirection(blogId: string): void {
    router.push({ name: "BlogViewer", params: { blogId: blogId, readonly: "true" } });
}
</script>

<template>
    <v-card variant="elevated" elevation="4" class="blog-card pa-3">
        <v-card-title @click="handleRedirection(blogId)" class="card-title mb-0 pa-0 text-center">
            {{ props.blogPostTitle }}
        </v-card-title>
        <v-card-subtitle class="pb-0 text-center">
            {{ props.blogCreationDate }}
        </v-card-subtitle>
    </v-card>
</template>

<style scoped>
.blog-card:hover {
    transform: scale(1.02);
    transition: 200ms linear;
}

.card-title:hover {
    text-decoration: underline !important;
    cursor: pointer !important;
}
</style>
