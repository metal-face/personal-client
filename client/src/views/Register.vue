<template>
    <v-row dense no-gutters justify="center">
        <CircleLoader :loading="loading" circleColor="black" />
        <v-col cols="6">
            <v-card height="100%" flat variant="outlined">
                <v-card-title class="text-center">
                    <h2 class="form-title ma-3">Register</h2>
                </v-card-title>
                <v-form>
                    <v-container fluid>
                        <v-row dense>
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
                                    type="text"
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
                </v-form>
                <v-card-actions class="d-flex align-center justify-end">
                    <v-btn @click="$router.go(-1)" variant="elevated" rounded="false" class="ma-1">
                        Back
                    </v-btn>
                    <v-btn
                        @click="dispatchRegistration"
                        variant="elevated"
                        rounded="false"
                        class="ma-1">
                        Submit
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-col>
    </v-row>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { Router, useRouter } from "vue-router";
import { useAuthStore } from "@/store/app";
import { useVuelidate } from "@vuelidate/core";
import { email, required, minLength, maxLength } from "@vuelidate/validators";
import AccountsServices from "@/services/AccountsServices";
import CircleLoader from "@/components/CircleLoader.vue";

const store = useAuthStore();
const router: Router = useRouter();

interface RegistrationForm {
    email: string;
    username: string;
    password: string;
}

const state: RegistrationForm = reactive({ email: "", username: "", password: "" });

const rules = {
    email: { required, email },
    username: { required, minLength: minLength(3), maxLength: maxLength(16) },
    password: { required, minLength: minLength(8), maxLength: maxLength(128) },
};

const v$ = useVuelidate(rules, state);

const visible = ref<boolean>(false);

const loading = ref<boolean>(false);

function toggleVisibility() {
    visible.value = !visible.value;
}

function clearForm(): void {
    v$.value.$reset();

    state.email = "";
    state.username = "";
    state.password = "";
}

function dispatchRegistration() {
    loading.value = true;

    v$.value.$validate();

    // TODO: Ensure th e password field passes server criteria before sending

    AccountsServices.createAccount(state.username, state.email, state.password)
        .catch((err) => {
            // TODO: handle error with snackbar to inform user
            console.error(err.request);
            console.error(err.response);
        })
        .then(() => {
            store.setUserEmail(state.email);
            store.setPassword(state.password);
            store.setUsername(state.username);
            router.push({ name: "UserProfile" });
        })
        .finally(() => {
            loading.value = false;
        });
}

onMounted(() => {
    state.email = String(store.getEmail);
});
</script>

<style scoped>
.form-title {
    font-family: "Prata", serif;
}
</style>
