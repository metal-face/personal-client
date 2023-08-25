<script setup lang="ts">
interface Props {
    blogTitle: string;
    blogPost: string;
    creationDate: string;
}

const props = defineProps<Props>();
</script>

<template>
    <v-card variant="flat" color="transparent" width="100%">
        <v-card-title>{{ props.blogTitle }}</v-card-title>
        <v-card-subtitle>{{ props.creationDate }}</v-card-subtitle>
    </v-card>
</template>

<style scoped></style>
