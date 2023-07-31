<script setup lang="ts">
interface Props {
    blogTitle: string;
    creationDate: Date;
}

const props = defineProps<Props>();
</script>

<template>
    <v-card>
        <v-card-title>{{ props.blogTitle }}</v-card-title>
        <v-card-subtitle>{{ props.creationDate }}</v-card-subtitle>
    </v-card>
</template>

<style scoped></style>
