<script setup lang="ts">
import { RouteParamsRaw, Router, useRouter } from "vue-router";
import { computed, ComputedRef, ref, Ref } from "vue";
import { DisplayInstance, ThemeInstance, useDisplay, useTheme } from "vuetify";

interface Props {
    blogTitle: string;
    blogPost: string;
    blogId: string;
    creationDate: string;
}

const theme: ThemeInstance = useTheme();

const display: DisplayInstance = useDisplay();

const isDark = computed<boolean>(() => {
    return theme.current.value.dark;
});

const router: Router = useRouter();
const props = defineProps<Props>();

const emit = defineEmits<{
    (e: "delete:confirm", value: string): void;
}>();

const blogId = computed<string>(() => {
    return props.blogId;
});

const mobileBreakpoint: ComputedRef<boolean> = computed<boolean>(() => {
    return display.mobile.value;
});
const isMobile: Ref<boolean> = ref<boolean>(false);

function handleResize(): void {
    switch (display.name.value) {
        case "xs":
            if (mobileBreakpoint.value) {
                isMobile.value = true;
            }
            break;
        case "sm":
            isMobile.value = false;
            break;
    }
}

function handleRedirection(name: string, params: object) {
    router.push({ name: name, params: params as RouteParamsRaw });
}
</script>

<template>
    <v-card
        v-resize="handleResize"
        :color="isDark ? 'secondary' : 'primary'"
        class="d-flex align-center my-2 pa-4"
        variant="elevated"
        elevation="4"
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
        <v-spacer />
        <v-card-actions>
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
                        :size="isMobile ? 'default' : 'x-large'"
                        rounded="1"
                        icon="mdi-pencil"
                        variant="elevated"
                        class="ma-0 mr-2 pa-0"
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
                        :size="isMobile ? 'default' : 'x-large'"
                        class="ma-0 pa-0"
                        variant="elevated"
                        rounded="1"
                        icon="mdi-trash-can"
                        color="error" />
                </template>
                <span>Delete</span>
            </v-tooltip>
        </v-card-actions>
    </v-card>
</template>

<style scoped>
.title:hover {
    cursor: pointer !important;
    text-decoration: underline !important;
}
</style>
