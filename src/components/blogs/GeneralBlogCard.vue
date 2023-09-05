<script setup lang="ts">
interface Props {
    blogPostTitle: string;
    blogCreationDate: string;
}

const props = defineProps<Props>();
</script>

<template>
    <v-card variant="elevated" elevation="4">
        <v-card-title>{{ props.blogPostTitle }}</v-card-title>
        <v-card-subtitle>{{ props.blogCreationDate }}</v-card-subtitle>
    </v-card>
</template>

<style scoped></style>
