<template>
    <v-overlay :model-value="props.loading" absolute persistent class="align-enter justify-center">
        <v-progress-circular :color="props.circleColor" indeterminate :size="128" :width="1" />
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
