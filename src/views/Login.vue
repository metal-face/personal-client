<template>
    <v-row dense no-gutters justify="center">
        <CircleLoader :loading="loading" circle-color="blue-darken-3" />
        <v-col :cols="$vuetify.display.mobile ? 12 : 6">
            <v-card flat height="100%" width="90%" class="mx-auto" variant="outlined">
                <v-card-title class="form-title ma-3">
                    <h2 class="text-center">Login</h2>
                </v-card-title>
                <v-form>
                    <v-container fluid>
                        <v-row dense>
                            <v-col cols="12">
                                <v-alert
                                    v-model="alert.visible"
                                    density="compact"
                                    :title="alert.title"
                                    :color="alert.color"
                                    :type="alert.type"
                                    :text="alert.text" />
                            </v-col>
                            <v-col cols="12">
                                <v-text-field
                                    v-model="state.username"
                                    @input="v$['username'].$touch"
                                    @blur="v$['username'].$touch"
                                    :error-messages="
                                        v$['username'].$errors.map((e) => e.$message.toString())
                                    "
                                    required
                                    variant="outlined"
                                    label="Username" />
                            </v-col>
                            <v-col cols="12">
                                <v-text-field
                                    v-model="state.password"
                                    @input="v$['password'].$touch"
                                    @blur="v$['password'].$touch"
                                    :error-messages="
                                        v$['password'].$errors.map((e) => e.$message.toString())
                                    "
                                    :type="visible ? 'text' : 'password'"
                                    required
                                    variant="outlined"
                                    label="Password">
                                    <template #append-inner>
                                        <v-icon @click="visible = !visible" icon="mdi-eye" />
                                    </template>
                                </v-text-field>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-form>
                <v-card-actions class="d-flex flex-column ma-2">
                    <v-btn
                        block
                        rounded="1"
                        size="x-large"
                        class="ma-1"
                        variant="flat"
                        color="accent"
                        @click="onClick">
                        Login
                    </v-btn>
                    <v-btn
                        @click="router.push({ name: 'Home' })"
                        rounded="1"
                        variant="flat"
                        block
                        class="ma-1"
                        size="x-large">
                        Cancel
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-col>
    </v-row>
</template>
<script setup lang="ts">
import { reactive, ref, defineEmits, computed, Ref } from "vue";
import { Router, useRouter } from "vue-router";
import { required, minLength, maxLength } from "@vuelidate/validators";
import { sessionStore } from "@/store/SessionStore";
import { useAccountStore } from "@/store/AccountStore";
import { useScriptTag } from "@vueuse/core";
import { Account } from "@/models/Account";
import { Role } from "@/models/Account";
import { Session } from "@/models/Session";
import { Alert } from "@/models/Alert";
import { AlertTypes } from "@/models/AlertTypes";
import { ColorTypes } from "@/models/ColorTypes";
import { LoginForm } from "@/models/LoginForm";
import AccountsServices from "@/services/AccountsServices";
import useVuelidate, { Validation } from "@vuelidate/core";
import SessionServices from "@/services/SessionServices";
import CircleLoader from "@/components/utils/CircleLoader.vue";

useScriptTag(
    "https://www.google.com/recaptcha/api.js?render=6Ldz_0snAAAAAEDnmEgNJgFAB2zWkOod_QJijLMM",
);

const emit = defineEmits<{
    (e: "username:update", username: string): void;
}>();

const router: Router = useRouter();
const sessStore = sessionStore();
const accountStore = useAccountStore();

const alert: Alert = reactive({
    type: AlertTypes.success,
    color: ColorTypes.success,
    title: "",
    text: "",
    visible: false,
    timeout: 0,
});

const state: LoginForm = reactive({ username: "", password: "" });

const rules = computed<object>(() => ({
    username: { required, minLength: minLength(3), maxLength: maxLength(16) },
    password: { required, minLength: minLength(8), maxLength: maxLength(128) },
}));

const v$: Ref<Validation<object, LoginForm>> = useVuelidate(rules, state);

const loading = ref<boolean>(false);
const visible = ref<boolean>(false);

const account: Account = reactive({
    account_id: "",
    username: "",
    email: "",
    role: Role.REGULAR,
    created_at: new Date(),
});

function onClick(e: Event) {
    e.preventDefault();
    //@ts-ignore
    grecaptcha.ready(function () {
        //@ts-ignore
        grecaptcha
            .execute("6Ldz_0snAAAAAEDnmEgNJgFAB2zWkOod_QJijLMM", { action: "submit" })
            .then(function (token: string) {
                loginUser(token).then((res) => {
                    if (res) {
                        fetchAccountById();
                    }
                });
            });
    });
}

async function fetchAccountById(): Promise<boolean> {
    if (account.account_id) {
        return AccountsServices.fetchAccountById(account.account_id)
            .then((res) => {
                accountStore.setAccount(res.data.data as Account);
                return true;
            })
            .catch((err) => {
                alert.color = ColorTypes.error;
                alert.text = err.message;
                alert.title = "Error";
                alert.type = AlertTypes.error;
                alert.visible = true;
                return false;
            });
    }
    return false;
}

async function loginUser(token: string): Promise<boolean> {
    loading.value = true;

    // Perform validation on the form
    let valid = await v$.value.$validate();
    if (!valid) {
        // If dirty, reset the form and exit the function.
        v$.value.$reset();
        return false;
    }

    return SessionServices.login(state.username, state.password, token)
        .then((res) => {
            sessStore.setSession(res.data.data as Session);

            account.account_id = res.data.data.account_id;
            account.created_at = new Date(res.data.data.created_at);

            emit("username:update", state.username);

            router.push({ name: "Home" });
            return true;
        })
        .finally(() => {
            loading.value = false;
        })
        .catch((err) => {
            alert.color = ColorTypes.error;
            alert.text = err.message;
            alert.title = "Error";
            alert.type = AlertTypes.error;
            alert.visible = true;
            return false;
        });
}
</script>
<style scoped>
.form-title {
    font-family: "Prata", serif;
}
</style>
