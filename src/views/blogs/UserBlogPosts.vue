<template>
    <v-card variant="elevated" color="primary" rounded="1" class="fill-height">
        <!-- TODO: list all blogs for the signed in user -->
        <!-- TODO: if there are no blogs, diplay an indicator to create a blog. -->
        <!-- TODO: add a create button that redirects the user to the create page. -->
        <v-card variant="flat" color="primary" rounded="1">
            <v-card variant="flat" color="primary" rounded="0">
                <v-card-actions class="my-0">
                    <v-btn
                        position="absolute"
                        location="right"
                        variant="elevated"
                        :to="{ name: 'BlogCreator' }"
                        class="my-1 mr-2"
                        color="accent"
                        rounded="1"
                        append-icon="mdi-pencil">
                        create
                    </v-btn>
                </v-card-actions>
            </v-card>
            <v-card-title class="page-title text-center ma-3">
                <h1 class="text-decoration-underline">Blog Posts</h1>
            </v-card-title>
        </v-card>
    </v-card>
</template>
<script lang="ts">
</script>
<style scoped>
.page-title {
    font-family: "Prata", "serif" ;
}
</style>
