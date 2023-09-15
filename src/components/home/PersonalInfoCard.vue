<template>
    <v-card variant="flat" color="transparent">
        <v-card-title
            class="page-title my-1 py-lg-6 py-md-3 py-sm-1 py-0 text-xxl-h2 text-lg-h3 text-md-h4 text-sm-h4 text-h5 text-xl-h3 text-center">
            Build Your Own Blogs
        </v-card-title>
        <v-card-text class="text-center page-clock text-body-2 text-sm-h6 ma-1 pa-1">
            {{ templateDate }}
        </v-card-text>
        <v-card-text class="page-clock text-center text-body-1 text-sm-h6 ma-1 pa-1">
            Built with ❤️ by MetalFace
        </v-card-text> </v-card
    >️
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
