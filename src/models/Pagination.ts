import { ComputedRef } from "vue";

export interface Pagination {
    page: number;
    length: ComputedRef<number>;
    totalVisible: number;
}
