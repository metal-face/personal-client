<script setup lang="ts">
import { ref, onUnmounted, onMounted, reactive } from "vue";
import { useRouter } from "vue-router";
import { format } from "date-fns";
import { useVuelidate } from "@vuelidate/core";
import { email, required } from "@vuelidate/validators";
import AccountsServices from "@/services/AccountsServices";

const router = useRouter();

interface State {
    userEmail: string;
}

interface Snackbar {
    message: string;
    visible: boolean;
    timeout: number;
}

const state: State = reactive({
    userEmail: "",
});

const snackbar: Snackbar = reactive({
    message: "",
    visible: false,
    timeout: 3000,
});

const rules = {
    userEmail: { required, email },
};

const v$ = useVuelidate(rules, state);

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

async function dispatchFetchUser() {
    toggleLoadingState(true);

    const result = await v$.value.$validate();

    if (!result) {
        toggleLoadingState(false);
        return;
    }

    AccountsServices.fetchAccountByEmail(state.userEmail)
        .catch((err) => {
            if (err.response.status === 500) {
                snackbar.visible = true;
                snackbar.message = "Oops! Something went wrong!";
            }
        })
        .then((res) => {
            if (!res) return;

            if (!res.data.data.length) {
                router.push({ name: "Register" });
            }

            if (Object.keys(res.data.data).length) {
                router.push({ name: "Login" });
            }
        })
        .finally(() => {
            toggleLoadingState(false);
        });
}

function toggleLoadingState(state: boolean): void {
    loading.value = state;
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
                <v-card color="transparent" flat>
                    <v-card-title class="page-title ma-1">
                        <h1 class="page-title text-center">Bryan Hughes</h1>
                    </v-card-title>
                    <v-card-subtitle class="page-clock ma-1">
                        <h3 class="text-center">Full-Stack Software Developer</h3>
                        <h3 class="text-center page-clock ma-1">{{ templateDate }}</h3>
                    </v-card-subtitle>
                    <v-card color="transparent" flat class="mt-12">
                        <label for="email" class="page-clock mb-3 d-flex justify-center">
                            Enter your email
                        </label>
                        <v-text-field
                            v-model="state.userEmail"
                            @click:append-inner="dispatchFetchUser"
                            @input="v$.userEmail.$touch"
                            @blur="v$.userEmail.$touch"
                            :error-messages="v$.userEmail.$errors.map((e) => e.$message.toString())"
                            :loading="loading"
                            variant="solo"
                            required
                            id="email"
                            class="page-clock"
                            prepend-inner-icon="mdi-email"
                            append-inner-icon="mdi-send" />
                    </v-card>
                </v-card>
            </v-card>
            <v-snackbar v-model="snackbar.visible" :timeout="snackbar.timeout">
                {{ snackbar.message }}
            </v-snackbar>
        </v-col>
    </v-row>
</template>
<style scoped>
.page-clock {
    font-family: "Source Code Pro", monospace !important;
}

.page-title {
    font-family: "Prata", serif !important;
}
</style>
