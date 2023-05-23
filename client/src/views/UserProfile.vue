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
import { useAppStore } from "@/store/app";
import { onMounted, ref } from "vue";

const store = useAppStore();

const username = ref<string>("");

onMounted(() => {
    username.value = store.getUsername;
});
</script>

<style scoped></style>
