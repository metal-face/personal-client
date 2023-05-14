<template>
    <v-row justify="center">
        <v-col cols="6">
            <v-card height="100%" flat>
                <v-card-title class="text-center"> Signup </v-card-title>
                <BaseForm>
                    <BaseInput
                        class="ma-2"
                        label="Email"
                        :counter="254"
                        variant="outlined"
                        placeholder="example@gmail.com" />
                </BaseForm>
            </v-card>
        </v-col>
    </v-row>
</template>
<script setup lang="ts">
import { defineProps } from "vue";
import BaseInput from "@/components/BaseInput.vue";
import BaseForm from "@/components/BaseForm.vue";

interface Props {
    email?: string;
}

const props = withDefaults(defineProps<Props>(), {
    email: "",
});
</script>
<style scoped></style>
