<template>
    <div class="d-flex align-center justify-space-between">
        <v-btn
            @click="router.push({ name: 'Login' })"
            size="large"
            append-icon="mdi-login"
            width="49%"
            variant="elevated"
            rounded="2">
            Login
        </v-btn>
        <v-btn
            @click="router.push({ name: 'Register' })"
            width="49%"
            append-icon="mdi-account-plus"
            size="large"
            variant="elevated"
            rounded="2">
            Register
        </v-btn>
    </div>
</template>
<script setup lang="ts">
import { useRouter, Router } from "vue-router";

const router: Router = useRouter();
</script>
