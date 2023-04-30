<template>
    <v-row class="fill-height">
        <CircleLoader :loading="loading" circleColor="blue" />
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

<script setup lang="ts">
import { ref, onUnmounted } from "vue";
import { format } from "date-fns";
import CircleLoader from "@/components/CircleLoader.vue";

const intervalID = ref<number>(createClock());
const templateDate = ref<string>("");
const loading = ref<boolean>(false);


function createClock(): number {
    return window.setInterval(() => {
        loading.value = true;
        updateCurrentTime().then(() => {
            loading.value = false;
        });
    }, 1000);
}
async function updateCurrentTime(): Promise<void> {
    templateDate.value = formatHumanReadableDate(Date.now());
}
function formatHumanReadableDate(current: number): string {
    return format(current, "PPPpp");
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
    font-family: "Playfair Display", serif !important;
}
</style>
