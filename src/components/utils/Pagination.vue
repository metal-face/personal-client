<script setup lang="ts">
import { computed, ComputedRef, reactive, ref } from "vue";
import { Pagination } from "@/models/Pagination";

interface Props {
    totalCount: number;
}

const emit = defineEmits<{
    (e: "update:change", page: number): void;
    (e: "prev", page: number): void;
    (e: "next", page: number): void;
}>();

const props = defineProps<Props>();

const totalBlogCount: ComputedRef<number> = computed<number>(() => {
    return props.totalCount;
});

const totalPages: ComputedRef<number> = computed<number>(() => {
    return Math.ceil(totalBlogCount.value / pagination.limit);
});

const pagination = reactive<Pagination>({
    page: ref<number>(1),
    limit: 10,
    length: totalPages,
    totalPagesVisible: 5,
    totalResourceCount: totalPages,
});
</script>

<template>
    <v-pagination
        v-model="pagination.page"
        :length="pagination.totalResourceCount"
        :total-visible="pagination.totalPagesVisible"
        :rounded="false"
        show-first-last-page
        class="pa-3"
        density="comfortable"
        variant="text"
        elevation="4"
        @update:modelValue="emit('update:change', pagination.page)"
        @prev="emit('prev', pagination.page)"
        @next="emit('next', pagination.page)" />
</template>
