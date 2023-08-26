<template>
    <v-row dense no-gutters justify="center">
        <CircleLoader :loading="loading" circleColor="black" />
        <v-col :cols="$vuetify.display.mobile ? 12 : 6">
            <v-card height="100%" width="90%" class="mx-auto" flat variant="outlined">
                <v-card-title class="text-center">
                    <h2 class="form-title ma-3">Register</h2>
                </v-card-title>
                <form id="registrationForm">
                    <v-container fluid>
                        <v-row dense>
                            <v-col cols="12">
                                <v-alert
                                    v-model="alert.visible"
                                    :title="alert.title"
                                    :text="alert.text"
                                    :type="alert.type"
                                    :color="alert.color"
                                    closable />
                            </v-col>
                            <v-col cols="12">
                                <v-text-field
                                    v-model="state.email"
                                    @input="v$.email.$touch"
                                    @blur="v$.email.$touch"
                                    :error-messages="
                                        v$.email.$errors.map((e) => e.$message.toString())
                                    "
                                    required
                                    variant="outlined"
                                    label="Email" />
                            </v-col>
                            <v-col cols="12">
                                <v-text-field
                                    v-model="state.username"
                                    @input="v$.username.$touch"
                                    @blur="v$.username.$touch"
                                    :error-messages="
                                        v$.username.$errors.map((e) => e.$message.toString())
                                    "
                                    required
                                    label="Username"
                                    variant="outlined" />
                            </v-col>
                            <v-col cols="12">
                                <v-text-field
                                    v-model="state.password"
                                    @click:append-inner="toggleVisibility"
                                    @input="v$.password.$touch"
                                    @blur="v$.password.$touch"
                                    :error-messages="
                                        v$.password.$errors.map((e) => e.$message.toString())
                                    "
                                    :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
                                    :type="visible ? 'text' : 'password'"
                                    required
                                    variant="outlined"
                                    label="Password" />
                            </v-col>
                        </v-row>
                    </v-container>
                </form>
                <v-card-actions class="d-flex flex-column align-center justify-end">
                    <v-btn
                        @click="onClick"
                        block
                        :disabled="disabled"
                        size="x-large"
                        color="accent"
                        variant="elevated"
                        rounded="false"
                        class="ma-1">
                        Register
                    </v-btn>
                    <v-btn
                        @click="router.push({ name: 'Home' })"
                        variant="flat"
                        block
                        color="primary"
                        size="x-large"
                        rounded="false"
                        class="ma-1">
                        Cancle
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-col>
    </v-row>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { Router, useRouter } from "vue-router";
import { useVuelidate } from "@vuelidate/core";
import { email, required, minLength, maxLength } from "@vuelidate/validators";
import AccountsServices from "@/services/AccountsServices";
import CircleLoader from "@/components/utils/CircleLoader.vue";
import SessionServices from "@/services/SessionServices";
import { sessionStore } from "@/store/SessionStore";
import type { AxiosResponse } from "axios";
import { useScriptTag } from "@vueuse/core";

// Load Google Recaptcha
useScriptTag(
    "https://www.google.com/recaptcha/api.js?render=6Ldz_0snAAAAAEDnmEgNJgFAB2zWkOod_QJijLMM",
);

function onClick(e: Event) {
    e.preventDefault();
    grecaptcha.ready(function () {
        grecaptcha
            .execute("6Ldz_0snAAAAAEDnmEgNJgFAB2zWkOod_QJijLMM", { action: "submit" })
            .then(function (token: string) {
                dispatchRegistration(token);
            });
    });
}

const router: Router = useRouter();
const session = sessionStore();

interface RegistrationForm {
    email: string;
    username: string;
    password: string;
}

interface Alert {
    type: AlertTypes;
    color: ColorTypes;
    title: string;
    text: string;
    visible: boolean;
    timeout: number;
}

enum AlertTypes {
    success = "success",
    info = "info",
    warning = "warning",
    error = "error",
}

enum ColorTypes {
    success = "success",
    info = "info",
    warning = "warning",
    error = "error",
}

const alert: Alert = reactive({
    type: AlertTypes.success,
    color: ColorTypes.success,
    title: "",
    text: "",
    visible: false,
    timeout: 0,
});

const state: RegistrationForm = reactive({ email: "", username: "", password: "" });

const rules = {
    email: { required, email },
    username: { required, minLength: minLength(3), maxLength: maxLength(16) },
    password: { required, minLength: minLength(8), maxLength: maxLength(128) },
};

const v$ = useVuelidate(rules, state);

const visible = ref<boolean>(false);

const loading = ref<boolean>(false);

const disabled = ref<boolean>(false);

onMounted(() => {
    clearForm();
});

function toggleVisibility() {
    visible.value = !visible.value;
}

function clearForm(): void {
    v$.value.$reset();

    state.email = "";
    state.username = "";
    state.password = "";
}

async function dispatchRegistration(token: string): Promise<void> {
    loading.value = true;

    const valid = await v$.value.$validate();

    if (!valid) {
        return;
    }

    // Register user
    registerUser(token)
        .then(() => {
            // Login user if successful registration
            // TODO: Login now requires a recaptcha token, see if the token you have is good, otherwise, get a new token
            loginUser(token)
                .then((res) => {
                    session.setSession(res.data.data);
                    router.push({ name: "Home" });
                })
                .finally(() => {
                    loading.value = false;
                })
                .catch((err) => {
                    alert.text = "Something Went Wrong!";
                    alert.color = ColorTypes.error;
                    alert.title = "Error!";
                    alert.type = AlertTypes.error;
                    alert.visible = true;
                    console.error(err);
                    loading.value = false;
                    return;
                });
        })
        .catch((err) => {
            loading.value = false;
            alert.text = err.response.data.message;
            alert.color = ColorTypes.error;
            alert.title = "Error!";
            alert.type = AlertTypes.error;
            alert.visible = true;
            console.error(err);
            return;
        });
}

async function registerUser(token: string): Promise<AxiosResponse<any, any>> {
    v$.value.$validate();

    // TODO: Ensure the password field passes server criteria before sending

    return AccountsServices.createAccount(state.username, state.email, state.password, token).then(
        (res) => {
            return res;
        },
    );
}

async function loginUser(token: string): Promise<AxiosResponse<any, any>> {
    return SessionServices.login(state.username, state.password, token).then((res) => {
        return res;
    });
}
</script>

<style scoped>
.form-title {
    font-family: "Prata", serif;
}
</style>
