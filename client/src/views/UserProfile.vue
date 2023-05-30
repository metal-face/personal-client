<template>
    <v-row dense>
        <v-col cols="12">
            <v-card>
                <v-card-title>
                    {{ username }}
                </v-card-title>
            </v-card>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/store/app";
import { onMounted, ref } from "vue";

const store = useAuthStore();

const username = ref<string>("");

onMounted(() => {
    username.value = String(store.getUsername);
});
</script>

<style scoped></style>
