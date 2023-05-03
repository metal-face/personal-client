<template>
    <v-overlay :model-value="props.loading" absolute contained persistent class="align-enter justify-center">
        <v-progress-circular :color="props.circleColor" indeterminate :size="128" :width="1" />
    </v-overlay>
</template>

<script setup lang="ts">
const props = defineProps({
    loading: {type: Boolean, required: true, default: false},
    circleColor: {type: String, required: false, default: "red"}
});

//  interface Props {
//     loading: boolean;
//     circleColor: string;
// }

// const props = withDefaults(defineProps<Props>(), {
//     loading: false,
//     circleColor: "purple",
// });
</script>

