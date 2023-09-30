import { ComputedRef, Ref } from "vue";

export interface Pagination {
    page: Ref<number>;
    limit: number;
    length: ComputedRef<number>;
    totalPagesVisible: number;
    totalResourceCount: ComputedRef<number>;
}
