<template>
    <v-row class="fill-height">
        <v-col cols="12">
            <v-card
                flat
                color="transparent"
                class="fill-height d-flex align-center justify-center"
                width="100%">
                <v-card
                    flat
                    color="transparent"
                    class="d-flex flex-column justify-center align-center"
                    height="100%"
                    width="50%">
                    <v-card flat color="transparent" class="text-center">
                        <v-card-title class="page-title text-xl-h1"> Bryan Hughes </v-card-title>
                        <v-card-subtitle class="page-title">
                            Full-Stack Software Developer
                        </v-card-subtitle>
                        <v-card-text class="page-clock"> {{ templateDate }} </v-card-text>
                    </v-card>
                </v-card>
            </v-card>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { format } from "date-fns";

onMounted(() => {
    createClock();
});

let templateDate = ref<string>("");

function updateCurrentTime(): void {
    templateDate.value = formatHumanReadableDate(Date.now());
}

function createClock(): number {
    return window.setInterval(() => {
        updateCurrentTime();
    }, 1000);
}

function formatHumanReadableDate(current: number): string {
    return format(current, "PPPPpp");
}
</script>

<style scoped>
.page-clock {
    font-family: "Source Code Pro", monospace !important;
}

.page-title {
    font-family: "Playfair Display", serif !important;
}
</style>
