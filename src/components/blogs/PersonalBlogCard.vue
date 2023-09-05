<script setup lang="ts">
interface Props {
    blogTitle: string;
    blogPost: string;
    creationDate: string;
}

const props = defineProps<Props>();
</script>

<template>
    <v-card
        class="ma-0 pa-0"
        variant="flat"
        color="transparent"
        height="100%"
        rounded="0"
        width="100%">
        <v-card-title class="my-0 ml-2 pa-0">{{ props.blogTitle }}</v-card-title>
        <v-card-subtitle class="my-0 ml-2 pa-0">{{ props.creationDate }}</v-card-subtitle>
    </v-card>
</template>

<style scoped></style>
