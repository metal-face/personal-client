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
                                <v-text-field
                                    v-model="state.username"
                                    @input="v$.username.$touch"
                                    @blur="v$.username.$touch"
                                    :error-messages="
                                        v$.username.$errors.map((e) => e.$message.toString())
                                    "
                                    required
                                    variant="outlined"
                                    label="Username" />
                            </v-col>
                            <v-col cols="12">
                                <v-text-field
                                    v-model="state.password"
                                    @input="v$.password.$touch"
                                    @blur="v$.password.$touch"
                                    :error-messages="
                                        v$.password.$errors.map((e) => e.$message.toString())
                                    "
                                    required
                                    variant="outlined"
                                    label="Password" />
                            </v-col>
                        </v-row>
                    </v-container>
                </v-form>
                <v-card-actions class="d-flex flex-column ma-2">
                    <v-btn
                        @click="router.push({ name: 'Home' })"
                        rounded="1"
                        variant="flat"
                        block
                        class="ma-1"
                        size="x-large">
                        Cancel
                    </v-btn>
                    <v-btn
                        block
                        rounded="1"
                        size="x-large"
                        class="ma-1"
                        variant="flat"
                        color="accent"
                        @click="dispatchLoginUser">
                        Login
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-col>
    </v-row>
</template>
<script setup lang="ts">
import { reactive, ref } from "vue";
import { Router, useRouter } from "vue-router";
import { required, minLength, maxLength } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import SessionServices from "@/services/SessionServices";
import CircleLoader from "@/components/CircleLoader.vue";

const router: Router = useRouter();

interface LoginForm {
    username: string;
    password: string;
}

const state: LoginForm = reactive({ username: "", password: "" });

const rules = {
    username: { required, minLength: minLength(3), maxLength: maxLength(16) },
    password: { required, minLength: minLength(8), maxLength: maxLength(128) },
};

const v$ = useVuelidate(rules, state);

const loading = ref<boolean>(false);

async function dispatchLoginUser(): Promise<void> {
    loading.value = true;

    let valid = await v$.value.$validate();
    if (!valid) {
        v$.value.$reset;
        return;
    }

    SessionServices.login(state.username, state.password)
        .catch((err) => {
            console.error(err);
            // TODO: handle error with snackbar
        })
        .then((res) => {
            if (!res) return;
            console.log(res);
            // TODO: Handle retaining session token in storage
        })
        .finally(() => {
            loading.value = false;
        });
}
</script>
<style scoped>
.form-title {
    font-family: "Prata", serif;
}
</style>
