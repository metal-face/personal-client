<script setup lang="ts">
import { ref, onUnmounted, onMounted } from "vue";
import { format } from "date-fns";
import CircleLoader from "@/components/CircleLoader.vue";

const intervalID = ref<number>(0);
const templateDate = ref<string>("");
const loading = ref<boolean>(false);

async function createClock(): Promise<void> {
    intervalID.value = window.setInterval(() => {
        templateDate.value = format(Date.now(), "PPPpp");
    }, 1000);
}

onMounted(() => {
    loading.value = true;

    createClock().then(() => {
        loading.value = false;
    });

});

onUnmounted(() => {
    window.clearInterval(intervalID.value);
});
</script>

<template>
    <v-row class="fill-height">
        <v-col cols="12">
            <CircleLoader :loading="loading" circleColor="gold"></CircleLoader>
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
