<template>
    <v-card flat>
        <v-text-field
            v-model="input"
            :label="props.label"
            :required="props.required"
            @input="onInput" />
    </v-card>
</template>

<script setup lang="ts">
import { ref } from "vue";

interface Props {
    label?: string;
    required: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    label: "",
    required: false,
});

const input = ref<string>("");

const emit = defineEmits<{
    (e: "input", value: string): void;
}>();

function onInput() {
    emit("input", input.value);
}
</script>

<style scoped></style>
