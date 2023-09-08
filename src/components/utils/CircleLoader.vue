<template>
    <v-overlay
        :model-value="props.loading"
        persistent
        class="d-flex flex-column align-center justify-center">
        <v-progress-circular :color="props.circleColor" indeterminate :size="124" :width="15" />
    </v-overlay>
</template>

<script setup lang="ts">
interface Props {
    loading: boolean;
    circleColor: string;
}

const props = withDefaults(defineProps<Props>(), {
    loading: false,
    circleColor: "purple",
});
</script>
