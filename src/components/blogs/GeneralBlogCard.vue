<script setup lang="ts">
import { computed, onMounted, reactive, ref, Ref } from "vue";
import { Router, useRouter } from "vue-router";
import { Account, Role } from "@/models/Account";
import AccountsServices from "@/services/AccountsServices";
import { DisplayInstance, useDisplay } from "vuetify";

onMounted(async () => {
    emit("loading", true);
    await fetchAccountById();
    emit("loading", false);
});

interface Props {
    account_id: string;
    blogId: string;
    blogPostTitle: string;
    blogCreationDate: string;
}

const emit = defineEmits<{
    (event: "loading", value: boolean): void;
}>();

const router: Router = useRouter();

const display: DisplayInstance = useDisplay();

const props = defineProps<Props>();

const account = reactive<Account>({
    account_id: "",
    username: "",
    email: "",
    role: Role.REGULAR,
    created_at: new Date(),
});

const blogId = computed<string>(() => {
    return props.blogId;
});

const accountId = computed<string>(() => {
    return props.account_id;
});

const isMobile: Ref<boolean> = ref<boolean>(false);

function handleResize(): void {
    switch (display.name.value) {
        case "xs":
            isMobile.value = true;
            break;
        case "sm":
            isMobile.value = false;
            break;
        default:
            isMobile.value = false;
    }
}

async function fetchAccountById(): Promise<boolean> {
    const res = await AccountsServices.fetchAccountById(accountId.value);

    if (!res) {
        return false;
    }

    account.account_id = res.data.data.account_id;

    switch (res.data.data.role) {
        case "REGULAR":
            account.role = Role.REGULAR;
            break;
        case "SUPER":
            account.role = Role.SUPER;
            break;
        case "ADMIN":
            account.role = Role.ADMIN;
            break;
        default:
            account.role = Role.REGULAR;
            break;
    }

    account.username = res.data.data.username;
    account.created_at = new Date(res.data?.data?.created_at);

    return true;
}

function handleRedirection(blogId: string): void {
    router.push({ name: "BlogViewer", params: { blogId: blogId, readonly: "true" } });
}
</script>

<template>
    <v-card v-resize="handleResize" variant="elevated" elevation="4" class="blog-card pa-3 ma-3">
        <v-card
            v-if="!isMobile"
            density="compact"
            flat
            position="absolute"
            location="top right"
            class="mr-2 mt-2">
            <v-chip color="grey" prepend-icon="mdi-account" variant="elevated" elevation="1">
                {{ account.username }}
            </v-chip>
        </v-card>
        <v-card
            v-if="isMobile"
            rounded
            flat
            location="top right"
            density="compact"
            class="d-flex justify-end pa-1">
            {{ account.username }}
        </v-card>
        <v-card-title @click="handleRedirection(blogId)" class="card-title mb-0 pa-0 text-center">
            {{ props.blogPostTitle }}
        </v-card-title>
        <v-card-subtitle class="pb-0 text-center">
            {{ props.blogCreationDate }}
        </v-card-subtitle>
    </v-card>
</template>

<style scoped>
.blog-card:hover {
    transform: scale(1.02);
    transition: 200ms linear;
}

.card-title:hover {
    text-decoration: underline !important;
    cursor: pointer !important;
}
</style>
