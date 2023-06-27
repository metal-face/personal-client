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
import { sessionStore } from "@/store/SessionStore";
import { onMounted, ref } from "vue";

const store = sessionStore();

const username = ref<string>("");

onMounted(() => {});
</script>

<style scoped></style>
@/store/user
