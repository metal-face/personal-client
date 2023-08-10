<script setup lang="ts">
import { ref, reactive, computed, ComputedRef } from "vue";
import { useAccountStore } from "@/store/AccountStore";
import PersonalButtonGroup from "@/components/home/PersonalButtonGroup.vue";
import GitHubLoginButton from "@/components/home/GitHubLoginButton.vue";
import AuthenticationButtons from "@/components/home/AuthenticationButtons.vue";
import PersonalInfoCard from "@/components/home/PersonalInfoCard.vue";
import CircleLoader from "@/components/CircleLoader.vue";

const accountStore = useAccountStore();

interface Snackbar {
    message: string;
    visible: boolean;
    timeout: number;
}

const loggedIn: ComputedRef<boolean> = computed(() => {
    return accountStore.isLoggedIn;
});

const snackbar: Snackbar = reactive({
    message: "",
    visible: false,
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
                class="d-flex flex-column justify-center align-center"
                height="90%"
                width="100%">
                <v-card color="transparent" flat class="ma-5">
                    <CircleLoader :loading="loading" circle-color="white" />
                    <PersonalInfoCard @loading="toggleLoadingState" />
                    <div v-if="!loggedIn" class="ma-6">
                        <!-- <GitHubLoginButton /> -->
                        <AuthenticationButtons />
                    </div>

                    <PersonalButtonGroup v-if="loggedIn" />
                </v-card>
            </v-card>
            <v-snackbar v-model="snackbar.visible" :timeout="snackbar.timeout">
                {{ snackbar.message }}
            </v-snackbar>
        </v-col>
    </v-row>
</template>
