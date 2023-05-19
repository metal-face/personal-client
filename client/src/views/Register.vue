<template>
    <v-row justify="center">
        <v-col cols="6">
            <v-card height="100%" flat>
                <v-card-title class="text-center"> Register </v-card-title>
                <v-form>
                    <v-text-field v-if="!email" :value="email" disabled />
                    <v-text-field v-else v-model="email" />
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
</script>
<style scoped></style>
