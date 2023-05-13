<template>
    <v-card>
        <v-card-title>Login</v-card-title>
        <v-card-subtitle>
            {{ props.email }}
        </v-card-subtitle>
    </v-card>
</template>
<script setup lang="ts">
import { defineProps } from "vue";

interface Props {
    email: string;
}

const props = withDefaults(defineProps<Props>(), {
    email: "",
});
</script>
<style scoped></style>
