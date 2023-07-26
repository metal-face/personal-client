<script setup lang="ts">
import { ref, onMounted, reactive, computed, ComputedRef } from "vue";
import { sessionStore } from "@/store/SessionStore";
import { useAccountStore } from "@/store/AccountStore";
import { Account, Role } from "@/models/Account";
import { Session } from "@/models/Session";
import AccountsServices from "@/services/AccountsServices";
import PersonalButtonGroup from "@/components/home/PersonalButtonGroup.vue";
import GitHubLoginButton from "@/components/home/GitHubLoginButton.vue";
import AuthenticationButtons from "@/components/home/AuthenticationButtons.vue";
import PersonalInfoCard from "@/components/home/PersonalInfoCard.vue";
import CircleLoader from "@/components/CircleLoader.vue";

const sessStore = sessionStore();
const accountStore = useAccountStore();

const emit = defineEmits<{
    (e: "account:change", account: Account): void;
}>();

interface Snackbar {
    message: string;
    visible: boolean;
    timeout: number;
}

const loggedIn: ComputedRef<boolean> = computed(() => {
    return accountStore.isLoggedIn;
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

const loading = ref<boolean>(true);

function toggleLoadingState(state: boolean): void {
    loading.value = state;
}

onMounted(() => {
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
                    <div v-if="!loggedIn" color="transparent" class="ma-6">
                        <GitHubLoginButton />
                        <p class="text-center font-weight-bold ma-2">OR</p>
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
