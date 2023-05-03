<script setup lang="ts">
import { ref, onUnmounted, onMounted } from "vue";
import { format } from "date-fns";
import CircleLoader from "@/components/CircleLoader.vue";

const intervalID = ref<number>(0);
const templateDate = ref<string>(format(Date.now(), "PPPpp"));
const loading = ref<boolean>(true);

function createClock() {
    intervalID.value = window.setInterval(() => {
        templateDate.value = format(Date.now(), "PPPpp");
    }, 1000);
    window.setTimeout(() => {
        loading.value = false;
    }, 1000);
}

onMounted(() => {
    createClock();
});

onUnmounted(() => {
    window.clearInterval(intervalID.value);
});
</script>

<template>
    <v-row class="fill-height">
        <CircleLoader v-model:loading="loading" />
        <v-col cols="12">
            <v-card
            flat
            color="transparent"
            class="fill-height d-flex flex-column justify-center align-center"
            width="100%">
                    <v-card-title class="page-title ma-1">
                        <h1>
                            Bryan Hughes
                        </h1>
                    </v-card-title>
                    <v-card-subtitle class="page-title ma-1">
                        <h3>
                            Full-Stack Software Developer
                        </h3>
                    </v-card-subtitle>
                    <h4 class="page-clock ma-1">{{ templateDate }}</h4>
            </v-card>
        </v-col>
    </v-row>
</template>
<style scoped>
.page-clock {
    font-family: "Source Code Pro", monospace !important;
}

.page-title {
    font-family: "Playfair Display", serif !important;
}
</style>
