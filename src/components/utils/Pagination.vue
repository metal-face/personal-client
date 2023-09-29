<script setup lang="ts">
import { computed, ComputedRef, reactive } from "vue";
import { Pagination } from "@/models/Pagination";
import { Blog } from "@/models/Blog";

interface Props {
    blogs: Blog[];
}

const emit = defineEmits<{
    (e: "prev", page: number): void;
    (e: "next", page: number): void;
}>();

const props = defineProps<Props>();

const blogsLength: ComputedRef<number> = computed<number>(() => {
    return props.blogs.length;
});

const pagination = reactive<Pagination>({
    page: 1,
    length: blogsLength,
    totalVisible: 10,
});
</script>

<template>
    <v-pagination
        v-model="pagination.page"
        :length="pagination.length"
        :total-visible="pagination.totalVisible"
        :rounded="false"
        color="primary"
        density="comfortable"
        variant="elevated"
        @prev="emit('prev', pagination.page)"
        @next="emit('next', pagination.page)" />
</template>
