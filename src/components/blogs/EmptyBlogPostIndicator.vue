<script setup lang="ts">
import { ThemeInstance, useTheme } from "vuetify";
import { computed, ComputedRef } from "vue";

interface Props {
    text: string;
}

const props = defineProps<Props>();

const theme: ThemeInstance = useTheme();

const isDark: ComputedRef<boolean> = computed<boolean>(() => {
    return theme.current.value.dark;
});
</script>

<template>
    <v-card
        variant="elevated"
        elevation="4"
        class="d-flex justify-center align-center ma-3 pa-3"
        :color="isDark ? 'primary' : 'white'">
        <v-card-title class="text-center">
            {{ props.text }}
        </v-card-title>
    </v-card>
</template>

<style scoped></style>
