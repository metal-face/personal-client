<template>
    <v-row justify="center">
        <CircleLoader :loading="loading" circleColor="black" />
        <v-col cols="6">
            <v-card height="100%" flat>
                <v-card-title class="text-center">
                    <h2 class="form-title ma-3">Register</h2>
                </v-card-title>
                <v-form>
                    <v-container fluid>
                        <v-row dense>
                            <v-col cols="12">
                                <v-text-field
                                    v-model="state.email"
                                    required
                                    variant="outlined"
                                    label="Email"
                                    :disabled="state.email ? true : false" />
                            </v-col>
                            <v-col cols="12">
                                <v-text-field
                                    v-model="state.username"
                                    label="Username"
                                    variant="outlined" />
                            </v-col>
                            <v-col cols="12">
                                <v-text-field
                                    v-model="state.password"
                                    @click:append-inner="toggleVisibility"
                                    append-inner-icon="mdi-eye"
                                    :type="visible ? 'text' : 'password'"
                                    variant="outlined"
                                    label="Password" />
                            </v-col>
                        </v-row>
                    </v-container>
                </v-form>
                <v-card-actions>
                    <v-btn> Submit </v-btn>
                </v-card-actions>
            </v-card>
        </v-col>
    </v-row>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { useAppStore } from "@/store/app";
import AccountsServices from "@/services/AccountsServices";
import CircleLoader from "@/components/CircleLoader.vue";

onMounted(() => {
    state.email = String(store.getEmail);
});

const store = useAppStore();

interface RegistrationForm {
    email: string;
    username: string;
    password: string;
}
const state: RegistrationForm = reactive({ email: "", username: "", password: "" });

const visible = ref<boolean>();
const loading = ref<boolean>();

function toggleVisibility() {
    visible.value = !visible.value;
}

function dispatchRegistration() {
    loading.value = true;

    AccountsServices.createAccount(state.username, state.email, state.password)
        .catch((err) => {
            console.error(err);
        })
        .then((res) => {
            console.log(res);
        })
        .finally(() => {
            loading.value = false;
        });
}
</script>
<style scoped>
.form-title {
    font-family: "Playfair Display", serif;
}
</style>
