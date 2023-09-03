<template>
    <v-overlay
        :model-value="props.loading"
        absolute
        :scrim="false"
        attach
        persistent
        class="d-flex align-enter justify-center">
        <v-progress-circular :color="props.circleColor" indeterminate :size="128" :width="15" />
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
