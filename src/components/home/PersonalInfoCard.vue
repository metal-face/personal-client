<template>
    <v-card-title class="page-title ma-1">
        <h1 class="page-title text-center">MetalFace</h1>
    </v-card-title>
    <v-card-subtitle class="page-clock ma-1">
        <h3 class="text-center">Full-Stack Software Developer</h3>
        <h3 class="text-center page-clock ma-1">{{ templateDate }}</h3>
    </v-card-subtitle>
</template>
<script setup lang="ts">
import { format } from "date-fns";
import { ref, onMounted, onUnmounted } from "vue";

const emit = defineEmits<{
    (e: "loading", loading: boolean): void;
}>();

onMounted(() => {
    emit("loading", true);
    createClock();
});

const intervalID = ref<number>(0);
const templateDate = ref<string>(format(Date.now(), "PPPpp"));

function createClock() {
    intervalID.value = window.setInterval(() => {
        templateDate.value = format(Date.now(), "PPPpp");
    }, 1000);
    window.setTimeout(() => {
        emit("loading", false);
    }, 1000);
}

onUnmounted(() => {
    window.clearInterval(intervalID.value);
});
</script>
<style scoped>
.page-clock {
    font-family: "Source Code Pro", monospace !important;
}

.page-title {
    font-family: "Prata", serif !important;
}
</style>
