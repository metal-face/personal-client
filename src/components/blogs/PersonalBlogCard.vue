<script setup lang="ts">
import { RouteParamsRaw, Router, useRouter } from "vue-router";
import { computed } from "vue";

interface Props {
    blogTitle: string;
    blogPost: string;
    blogId: string;
    creationDate: string;
}

const router: Router = useRouter();
const props = defineProps<Props>();

const emit = defineEmits<{
    (e: "delete:confirm", value: string): void;
}>();

const blogId = computed<string>(() => {
    return props.blogId;
});

function handleRedirection(name: string, params: object) {
    router.push({ name: name, params: params as RouteParamsRaw });
}
</script>

<template>
    <v-card
        class="d-flex justify-space-between align-center my-2 pa-4"
        variant="elevated"
        elevation="4"
        color="transparent"
        height="100%"
        rounded="1"
        width="100%">
        <div>
            <v-card-title
                @click="
                    handleRedirection('BlogViewer', {
                        blogId: props.blogId,
                        readonly: 'true',
                    })
                "
                class="title my-0 ml-2 pa-0">
                {{ props.blogTitle }}
            </v-card-title>
            <v-card-subtitle class="my-0 ml-2 pa-0">{{ props.creationDate }}</v-card-subtitle>
        </div>
        <div>
            <!-- EDIT-->
            <v-tooltip location="top">
                <template #activator="{ props }">
                    <v-btn
                        @click="
                            handleRedirection('BlogUpdater', {
                                blogId: blogId,
                                readonly: 'false',
                            })
                        "
                        v-bind="props"
                        size="x-large"
                        rounded="1"
                        icon="mdi-pencil"
                        variant="elevated"
                        class="ma-0 mr-1 pa-0"
                        color="info">
                    </v-btn>
                </template>
                <span>Edit</span>
            </v-tooltip>

            <!-- DELETE -->
            <v-tooltip location="top">
                <template #activator="{ props }">
                    <v-btn
                        @click="emit('delete:confirm', blogId)"
                        v-bind="props"
                        size="x-large"
                        class="ma-0 pa-0"
                        variant="flat"
                        position="fixed"
                        rounded="1"
                        icon="mdi-trash-can"
                        color="error" />
                </template>
                <span>Delete</span>
            </v-tooltip>
        </div>
    </v-card>
</template>

<style scoped>
.title:hover {
    cursor: pointer !important;
    text-decoration: underline !important;
}
</style>
