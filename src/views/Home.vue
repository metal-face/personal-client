<script setup lang="ts">
import { ref, reactive, computed, ComputedRef } from "vue";
import { useAccountStore } from "@/store/AccountStore";
import PersonalButtonGroup from "@/components/home/PersonalButtonGroup.vue";
import AuthenticationButtons from "@/components/home/AuthenticationButtons.vue";
import PersonalInfoCard from "@/components/home/PersonalInfoCard.vue";
import CircleLoader from "@/components/utils/CircleLoader.vue";
import { Snackbar } from "@/models/Snackbar";

const accountStore = useAccountStore();

const loggedIn: ComputedRef<boolean> = computed(() => {
    return accountStore.isLoggedIn;
});

const snackbar: Snackbar = reactive({
    visible: false,
    text: "",
    color: "error",
    timeout: 3000,
});

const loading = ref<boolean>(true);

function toggleLoadingState(state: boolean): void {
    loading.value = state;
}
</script>

<template>
    <v-row class="fill-height">
        <v-col cols="12">
            <v-card
                flat
                color="transparent"
                class="fill-height d-flex flex-column justify-center align-center"
                width="100%">
                <v-card color="transparent" flat class="ma-5">
                    <CircleLoader :loading="loading" circle-color="pink" />

                    <PersonalInfoCard @loading="toggleLoadingState" />
                    <AuthenticationButtons v-if="!loggedIn" class="ma-6" />
                    <PersonalButtonGroup v-if="loggedIn" />
                </v-card>
            </v-card>
            <v-snackbar v-model="snackbar.visible" :timeout="snackbar.timeout">
                {{ snackbar.text }}
            </v-snackbar>
        </v-col>
    </v-row>
</template>
