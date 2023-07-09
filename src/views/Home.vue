<script setup lang="ts">
import { ref, onUnmounted, onMounted, reactive, computed } from "vue";
import { useRouter } from "vue-router";
import { format } from "date-fns";
import { useVuelidate } from "@vuelidate/core";
import { email, required } from "@vuelidate/validators";
import { sessionStore } from "@/store/SessionStore";
import { useAccountStore } from "@/store/AccountStore";
import { Account, Role } from "@/models/Account";
import { Session } from "@/models/Session";
import AccountsServices from "@/services/AccountsServices";
import { ComputedRef } from "vue";

const router = useRouter();
const sessStore = sessionStore();
const accountStore = useAccountStore();

const emit = defineEmits<{
    (e: "account:change", account: Account): void;
}>();

interface State {
    userEmail: string;
}

interface Snackbar {
    message: string;
    visible: boolean;
    timeout: number;
}

const isLoggedIn: ComputedRef<boolean> = computed(() => {
    return accountStore.isLoggedIn;
});

const state: State = reactive({
    userEmail: "",
});

const session: Session = reactive({
    account_id: "",
    session_id: "",
    created_at: new Date(),
    expires_at: new Date(),
    user_agent: "",
});

const account: Account = reactive({
    account_id: "",
    username: "",
    email: "",
    role: Role.REGULAR,
    created_at: new Date(),
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

async function fetchUserByEmail() {
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
                router.push({ name: "Register", params: { email: state.userEmail } });
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

    const resp = window.localStorage.getItem("session");
    if (resp) {
        const jsonResponse = JSON.parse(resp) as Session;

        Object.assign(session, jsonResponse);

        if (Object.keys(session).length) {
            sessStore.setSession(session);

            if (sessStore.isExpired) {
                sessStore.destroySessionInStorage;
                sessStore.clearSession;
                return;
            }

            if (session.account_id) {
                AccountsServices.fetchAccountById(session.account_id)
                    .catch((err) => {
                        console.warn(err.response);
                    })
                    .then((res) => {
                        if (!res) return;
                        Object.assign(account, res.data.data);
                        accountStore.setAccount(account);
                    })
                    .finally(() => {
                        emit("account:change", account);
                    });
            }
        }
    }
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
                        <h1 class="page-title text-center">MetalFace</h1>
                    </v-card-title>
                    <v-card-subtitle class="page-clock ma-1">
                        <h3 class="text-center">Full-Stack Software Developer</h3>
                        <h3 class="text-center page-clock ma-1">{{ templateDate }}</h3>
                    </v-card-subtitle>

                    <!-- TODO Encapsulate this into it's own component -->
                    <v-card v-if="!isLoggedIn" color="transparent" flat class="mt-12">
                        <label for="email" class="page-clock mb-3 d-flex justify-center">
                            Enter your email
                        </label>
                        <v-text-field
                            v-model="state.userEmail"
                            @input="v$.userEmail.$touch"
                            @blur="v$.userEmail.$touch"
                            :error-messages="v$.userEmail.$errors.map((e) => e.$message.toString())"
                            :loading="loading"
                            variant="solo"
                            required
                            id="email"
                            class="d-flex flex-column page-clock">
                            <template #prepend-inner>
                                <div>
                                    <v-icon size="large" color="accent"> mdi-email </v-icon>
                                </div>
                            </template>
                            <template #append-inner>
                                <div>
                                    <v-btn
                                        @click="fetchUserByEmail"
                                        block
                                        rounded="false"
                                        size="small"
                                        color="accent">
                                        <v-icon color="black" size="small"> mdi-send </v-icon>
                                    </v-btn>
                                </div>
                            </template>
                        </v-text-field>
                    </v-card>

                    <v-card
                        v-if="isLoggedIn"
                        color="transparent"
                        flat
                        rounded="0"
                        class="d-flex flex-wrap align-center justify-space-between">
                        <div class="ma-2">
                            <v-tooltip text="metal-face" location="bottom">
                                <template #activator="{ props }">
                                    <v-btn
                                        v-bind="props"
                                        rounded="1"
                                        href="https://www.github.com/metal-face"
                                        target="_blank"
                                        variant="elevated"
                                        elevation="4"
                                        color="primary">
                                        <v-icon size="large" icon="mdi-github" />
                                    </v-btn>
                                </template>
                            </v-tooltip>
                        </div>
                        <div class="ma-2">
                            <v-tooltip location="bottom" text="bryanhughes1992">
                                <template #activator="{ props }">
                                    <v-btn
                                        v-bind="props"
                                        rounded="1"
                                        href="https://www.linkedin.com/in/bryanhughes1992/"
                                        variant="elevated"
                                        elevation="4"
                                        color="primary">
                                        <v-icon size="large" color="#0077B5" icon="mdi-linkedin" />
                                    </v-btn>
                                </template>
                            </v-tooltip>
                        </div>
                        <div class="ma-2">
                            <v-tooltip text="scrotalmass" location="bottom">
                                <template #activator="{ props }">
                                    <v-btn
                                        v-bind="props"
                                        rounded="1"
                                        href="https://twitter.com/scrotalmass"
                                        variant="elevated"
                                        elevation="4"
                                        color="primary">
                                        <v-icon size="large" icon="mdi-twitter" color="#2598fe" />
                                    </v-btn>
                                </template>
                            </v-tooltip>
                        </div>
                        <div class="ma-2">
                            <v-tooltip text="metalfaces" location="bottom">
                                <template #activator="{ props }">
                                    <v-btn
                                        v-bind="props"
                                        href="https://discordapp.com/users/516293689774178316"
                                        rounded="1"
                                        variant="elevated"
                                        elevation="4"
                                        color="primary">
                                        <svg
                                            height="1.5rem"
                                            width="1.5rem"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 127.14 96.36">
                                            <g id="图层_2" data-name="图层 2">
                                                <g id="Discord_Logos" data-name="Discord Logos">
                                                    <g
                                                        id="Discord_Logo_-_Large_-_White"
                                                        data-name="Discord Logo - Large - White">
                                                        <path
                                                            fill="#5865f2"
                                                            class="cls-1"
                                                            d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z" />
                                                    </g>
                                                </g>
                                            </g>
                                        </svg>
                                    </v-btn>
                                </template>
                            </v-tooltip>
                        </div>
                        <div class="ma-2">
                            <v-tooltip text="Email" location="bottom">
                                <template #activator="{ props }">
                                    <v-btn
                                        v-bind="props"
                                        rounded="1"
                                        href="mailto:mail@bryanhughes.net"
                                        variant="elevated"
                                        elevation="4"
                                        color="primary">
                                        <v-icon size="large" icon="mdi-email" />
                                    </v-btn>
                                </template>
                            </v-tooltip>
                        </div>
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