<script setup lang="ts">
interface Props {
    blogPostTitle: string;
    blogCreationDate: string;
}

const props = defineProps<Props>();
</script>

<template>
    <v-card variant="elevated" elevation="4" class="blog-card pa-3">
        <v-card-title class="mb-0 pa-0 text-center">
            {{ props.blogPostTitle }}
        </v-card-title>
        <v-card-subtitle class="pb-0 text-center">
            {{ props.blogCreationDate }}
        </v-card-subtitle>
    </v-card>
</template>

<style scoped>
.blog-card:hover {
    text-decoration: underline !important;
    transform: scale(1.02);
    transition: 200ms linear;
}
</style>
