<template>
    <v-container fluid>
        <v-row dense>
            <v-col cols="12">
                <v-card height="100%">
                    <v-form>
                        <slot></slot>
                    </v-form>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts"></script>

<style scoped></style>
