<script setup lang="ts">
import { ref, onUnmounted, onMounted } from "vue";
import { format } from "date-fns";
// import CircleLoader from "@/components/CircleLoader.vue";

const intervalID = ref<number>(0);
const templateDate = ref<string>(format(Date.now(), "PPPpp"));
const loading = ref<boolean>(true);
const userEmail = ref<string>("");

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
        <v-col cols="12">
            <v-card
                flat
                color="transparent"
                class="d-flex flex-column justify-center align-center"
                height="90%"
                width="100%">
                <!-- <CircleLoader
                    :loading="true"
                    circleColor="pink"
                    class="d-flex justify-center align-center" /> -->
                <v-card color="transparent" flat>
                    <v-card-title class="page-title ma-1">
                        <h1 class="text-center">Bryan Hughes</h1>
                    </v-card-title>
                    <v-card-subtitle class="page-clock ma-1">
                        <h3 class="text-center">Full-Stack Software Developer</h3>
                        <h3 class="text-center page-clock ma-1">{{ templateDate }}</h3>
                    </v-card-subtitle>
                    <v-card color="transparent" flat class="mt-12">
                        <label for="email" class="page-clock d-flex justify-center">
                            Enter your email
                        </label>
                        <v-text-field
                            id="email"
                            v-model="userEmail"
                            variant="underlined"
                            class="page-clock"
                            append-inner-icon="mdi-email" />
                    </v-card>
                </v-card>
            </v-card>
            <v-card height="auto" flat color="transparent" width="100%">
                <v-card-subtitle class="text-center">
                    <h4 class="text-center page-clock">Made with 🖤 by Metal-Face</h4>
                </v-card-subtitle>
            </v-card>
        </v-col>
    </v-row>
</template>
<style scoped>
.page-clock {
    font-family: "Source Code Pro", monospace !important;
}

.page-title {
    font-family: "Calistoga", cursive !important;
}
</style>
