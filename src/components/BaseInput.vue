<template>
    <v-text-field
        v-model="input"
        :label="props.label"
        :variant="props.variant"
        :counter="props.counter"
        :placeholder="props.placeholder"
        density="comfortable"
        @input="onInput" />
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

interface Props {
    email?: string;
    label: string;
    variant: string;
    counter: number;
    placeholder: string;
}

const props = withDefaults(defineProps<Props>(), {
    email: "",
    label: "",
    variant: "plain",
    placeholder: "",
});

const input = ref<string>("");

const emit = defineEmits<{
    (e: "input", value: string): void;
}>();

function onInput() {
    emit("input", input.value);
}

onMounted(() => {
    if (props.email !== "") {
        input.value = props.email;
    }
});
</script>

<style scoped></style>
