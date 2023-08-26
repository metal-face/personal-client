import { Ref } from "vue";

export interface ConfirmDeleteState {
    visible: Ref<boolean>;
    idToDelete: Ref<string | number>;
}
