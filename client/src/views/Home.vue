<template>
    <v-row class="fill-height">
        <CircleLoader :loading="loading" circleColor="blue" />
        <v-col cols="12">
            <v-card
                flat
                color="transparent"
                class="fill-height d-flex align-center justify-center"
                width="100%">
                <v-card flat color="transparent" class="text-center">
                    <v-card-title class="page-title">
                        <h1>Bryan Hughes</h1>
                    </v-card-title>
                    <v-card-subtitle class="page-title">
                        <h2>Full-Stack Software Developer</h2>
                    </v-card-subtitle>

                    <v-card-text class="page-clock">
                        <h3>
                            {{ templateDate }}
                        </h3>
                    </v-card-text>
                </v-card>
            </v-card>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from "vue";
import { format } from "date-fns";
import CircleLoader from "@/components/CircleLoader.vue";

let loading: boolean = true;

const templateDate = ref<string>("");
const intervalID: number = createClock();

function createClock(): number {
    return window.setInterval(() => {
        updateCurrentTime();
    }, 1000);
}
function updateCurrentTime(): void {
    templateDate.value = formatHumanReadableDate(Date.now());
}
function formatHumanReadableDate(current: number): string {
    return format(current, "PPPpp");
}

onUnmounted(() => {
    window.clearInterval(intervalID);
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
