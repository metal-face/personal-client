<template>
    <v-overlay :value="props.loading" absolute>
        <v-progress-circular :color="props.circleColor" indeterminate :size="128" />
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

