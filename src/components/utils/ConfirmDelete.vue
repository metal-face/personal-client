<script setup lang="ts">
interface Props {
    visible: boolean;
    resourceId: string;
}

const emit = defineEmits<{
    (e: "confirm:cancel"): void;
    (e: "confirm:delete", value: string): void;
}>();

const props = withDefaults(defineProps<Props>(), {
    visible: false,
});
</script>

<template>
    <v-dialog :model-value="props.visible" persistent skrim="#000">
        <v-card variant="elevated" elevation="8" color="primary">
            <v-card-title class="text-center text-uppercase text-decoration-underline">
                Confirm Delete
            </v-card-title>
            <v-card-text class="text-center">
                <p>Are you sure you would like to delete this blog?</p>
                <strong>This operation is permanent and cannot be undone.</strong>
            </v-card-text>
            <v-card-actions class="d-flex flex-column">
                <v-btn
                    @click="emit('confirm:cancel')"
                    variant="flat"
                    rounded="1"
                    block
                    color="grey"
                    class="mb-1 mx-auto">
                    Cancel
                </v-btn>
                <v-btn
                    @click="emit('confirm:delete', props.resourceId)"
                    rounded="1"
                    block
                    class="mx-auto"
                    variant="flat"
                    color="red">
                    Delete
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
