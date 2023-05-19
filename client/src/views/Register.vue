<template>
    <v-row justify="center">
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
                                    v-model="email"
                                    variant="outlined"
                                    label="Email"
                                    :disabled="email ? true : false" />
                            </v-col>
                            <v-col cols="12">
                                <v-text-field
                                    v-model="username"
                                    label="Username"
                                    variant="outlined" />
                            </v-col>
                            <v-col cols="12">
                                <v-text-field
                                    v-model="password"
                                    @click:append-inner="toggleVisibility"
                                    append-inner-icon="mdi-eye"
                                    :type="visible ? 'text' : 'password'"
                                    variant="outlined"
                                    label="Password" />
                            </v-col>
                        </v-row>
                    </v-container>
                </v-form>
            </v-card>
        </v-col>
    </v-row>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { useAppStore } from "@/store/app";
import { onMounted } from "vue";

const store = useAppStore();

onMounted(() => {
    email.value = store.getUserEmail;
});

const email = ref<string>("");
const password = ref<string>("");
const username = ref<string>("");
const visible = ref<boolean>();

function toggleVisibility() {
    visible.value = !visible.value;
}
</script>
<style scoped>
.form-title {
    font-family: "Playfair Display", serif;
}
</style>
