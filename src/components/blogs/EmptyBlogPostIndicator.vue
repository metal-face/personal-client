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
        class="d-flex justify-center align-center"
        :color="isDark ? 'black' : 'white'">
        <v-card-text class="text-center">
            {{ props.text }}
        </v-card-text>
    </v-card>
</template>

<style scoped></style>
