<script setup lang="ts">
import BlogServices from "@/services/BlogServices";
import { onMounted, reactive } from "vue";
import { Blogs } from "@/models/Blogs";

const blogs = reactive<Blogs>([]);

async function fetchManyBlogs() {
    return BlogServices.fetchManyBlogs()
        .then((res) => {
            console.log(res);
        })
        .catch((err) => {
            console.error(err);
        });
}

onMounted(async () => {
    await fetchManyBlogs();
});
</script>

<template>
    <v-row>
        <v-col>
            <v-card>
                <v-card-title> Your Feed </v-card-title>
            </v-card>
        </v-col>
    </v-row>
</template>

<style scoped></style>
