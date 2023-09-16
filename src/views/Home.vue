<script setup lang="ts">
import { ref, reactive, computed, ComputedRef } from "vue";
import { useAccountStore } from "@/store/AccountStore";
import { Snackbar } from "@/models/Snackbar";
import PersonalButtonGroup from "@/components/home/PersonalButtonGroup.vue";
import AuthenticationButtons from "@/components/home/AuthenticationButtons.vue";
import PersonalInfoCard from "@/components/home/PersonalInfoCard.vue";
import CircleLoader from "@/components/utils/CircleLoader.vue";
import MarkdownEditor from "@/components/blogs/MarkdownEditor.vue";
import { DisplayInstance, useDisplay } from "vuetify";

const accountStore = useAccountStore();

const loggedIn: ComputedRef<boolean> = computed(() => {
    return accountStore.isLoggedIn;
});

const display: DisplayInstance = useDisplay();

const snackbar: Snackbar = reactive({
    visible: false,
    text: "",
    color: "error",
    timeout: 3000,
});

const loading = ref<boolean>(true);

const colCount = ref<number>(0);

function toggleLoadingState(state: boolean): void {
    loading.value = state;
}

function onResize(): void {
    switch (display.name.value) {
        case "xs":
            colCount.value = 12;
            break;
        case "sm":
            colCount.value = 10;
            break;
        case "md":
            colCount.value = 8;
            break;
        case "lg":
            colCount.value = 6;
            break;
        case "xl":
            colCount.value = 6;
            break;
    }
}
</script>

<template>
    <v-container fluid class="pa-0">
        <v-row v-resize="onResize" class="fill-height" justify="center">
            <v-col cols="12">
                <v-card
                    flat
                    color="transparent"
                    class="d-flex flex-column justify-start align-center"
                    width="100%">
                    <v-card color="transparent" flat class="ma-0">
                        <CircleLoader :loading="loading" circle-color="accent" />
                        <PersonalInfoCard @loading="toggleLoadingState" />
                        <AuthenticationButtons v-if="!loggedIn" class="ma-1" />
                        <PersonalButtonGroup v-if="loggedIn" />
                    </v-card>
                </v-card>
                <v-snackbar v-model="snackbar.visible" :timeout="snackbar.timeout">
                    {{ snackbar.text }}
                </v-snackbar>
            </v-col>
            <v-row justify="center" align-content="center">
                <v-col :cols="colCount">
                    <v-card variant="elevated" elevation="8">
                        <MarkdownEditor :demo="true" />
                    </v-card>
                </v-col>
            </v-row>
        </v-row>
    </v-container>
</template>
