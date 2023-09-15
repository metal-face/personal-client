<script setup lang="ts">
import { ref, reactive, onMounted, defineEmits, computed, Ref } from "vue";
import { Router, useRouter } from "vue-router";
import { ErrorObject, useVuelidate, Validation } from "@vuelidate/core";
import { email, required, minLength, maxLength, helpers } from "@vuelidate/validators";
import { sessionStore } from "@/store/SessionStore";
import { useScriptTag } from "@vueuse/core";
import { Alert } from "@/models/Alert";
import { AlertTypes } from "@/models/AlertTypes";
import { ColorTypes } from "@/models/ColorTypes";
import { RegistrationForm } from "@/models/RegistrationForm";
import AccountsServices from "@/services/AccountsServices";
import CircleLoader from "@/components/utils/CircleLoader.vue";
import SessionServices from "@/services/SessionServices";

onMounted(() => {
    clearForm();
});

// Load Google Recaptcha
useScriptTag(
    "https://www.google.com/recaptcha/api.js?render=6Ldz_0snAAAAAEDnmEgNJgFAB2zWkOod_QJijLMM",
);

const router: Router = useRouter();
const session = sessionStore();

const alert: Alert = reactive({
    type: AlertTypes.success,
    color: ColorTypes.success,
    title: "",
    text: "",
    visible: false,
    timeout: 0,
});

const state: RegistrationForm = reactive({ email: "", username: "", password: "" });
const passwordRequirements = (value: string): boolean => {
    const pattern: RegExp = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@#$%^&+=!])/;

    return pattern.test(value);
};

const rules = computed<object>(() => ({
    email: { required, email },
    username: { required, minLength: minLength(3), maxLength: maxLength(16) },
    password: {
        required,
        minLength: minLength(8),
        maxLength: maxLength(128),
        passwordRequirements: helpers.withMessage(
            "Password must contain one uppercase, lowercase, and special character",
            passwordRequirements,
        ),
    },
}));

const v$: Ref<Validation<object, RegistrationForm>> = useVuelidate(rules, state);

const visible = ref<boolean>(false);

const loading = ref<boolean>(false);

const disabled = ref<boolean>(false);

const emit = defineEmits<{
    (e: "username:update", username: string): void;
}>();

function onClick(e: Event) {
    e.preventDefault();
    //@ts-ignore
    // eslint-disable-next-line no-undef
    grecaptcha.ready(function () {
        //@ts-ignore
        // eslint-disable-next-line no-undef
        grecaptcha
            .execute("6Ldz_0snAAAAAEDnmEgNJgFAB2zWkOod_QJijLMM", { action: "submit" })
            .then(function (token: string) {
                dispatchRegistration(token);
            });
    });
}

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
    const regResp = await registerUser(token);

    if (regResp) {
        // @ts-ignore
        // eslint-disable-next-line no-undef
        grecaptcha.ready(function () {
            //@ts-ignore
            // eslint-disable-next-line no-undef
            grecaptcha
                .execute("6Ldz_0snAAAAAEDnmEgNJgFAB2zWkOod_QJijLMM", { action: "submit" })
                .then(async function (token: string) {
                    await loginUser(token);
                    await router.push({ name: "Home" });
                });
        });
    }
}

async function registerUser(token: string): Promise<boolean> {
    await v$.value.$validate();

    // TODO: Ensure the password field passes server criteria before sending

    return AccountsServices.createAccount(state.username, state.email, state.password, token)
        .then(() => {
            return true;
        })
        .catch((err) => {
            loading.value = false;
            alert.text = err.response.data.message;
            alert.color = ColorTypes.error;
            alert.title = "Error!";
            alert.type = AlertTypes.error;
            alert.visible = true;
            console.error(err);
            return false;
        });
}

async function loginUser(token: string): Promise<boolean> {
    return SessionServices.login(state.username, state.password, token)
        .then((res) => {
            session.setSession(res.data.data);
            emit("username:update", state.username);
            loading.value = false;
            return true;
        })
        .catch((err) => {
            alert.text = "Something Went Wrong!";
            alert.color = ColorTypes.error;
            alert.title = "Error!";
            alert.type = AlertTypes.error;
            alert.visible = true;
            console.error(err);
            loading.value = false;
            return false;
        });
}
</script>
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
                                    @input="v$['email'].$touch"
                                    @blur="v$['email'].$touch"
                                    :error-messages="
                                        v$['email'].$errors.map((e: ErrorObject) => e.$message.toString())
                                    "
                                    required
                                    variant="outlined"
                                    label="Email" />
                            </v-col>
                            <v-col cols="12">
                                <v-text-field
                                    v-model="state.username"
                                    @input="v$['username'].$touch"
                                    @blur="v$['username'].$touch"
                                    :error-messages="
                                        v$['username'].$errors.map((e: ErrorObject) => e.$message.toString())
                                    "
                                    required
                                    label="Username"
                                    variant="outlined" />
                            </v-col>
                            <v-col cols="12">
                                <v-text-field
                                    v-model="state.password"
                                    @click:append-inner="toggleVisibility"
                                    @input="v$['password'].$touch"
                                    @blur="v$['password'].$touch"
                                    :error-messages="
                                        v$['password'].$errors.map((e: ErrorObject) => e.$message.toString())
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
                        :disabled="disabled"
                        block
                        size="x-large"
                        color="accent"
                        variant="flat"
                        rounded="false"
                        class="ma-1">
                        Register
                    </v-btn>
                    <v-btn
                        @click="router.push({ name: 'Home' })"
                        variant="flat"
                        block
                        color="grey-lighten-2"
                        size="x-large"
                        rounded="1"
                        class="ma-1">
                        Cancel
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-col>
    </v-row>
</template>

<style scoped>
.form-title {
    font-family: "Prata", serif;
}
</style>
