<template>
    <v-app>
        <v-app-bar flat>
            <v-btn color="white" icon="mdi-menu" variant="outlined" />
        </v-app-bar>

        <v-navigation-drawer>
            <v-list>
                <v-list-item></v-list-item>
            </v-list>
        </v-navigation-drawer>

        <v-main>
            <v-container fluid>
                <router-view />
            </v-container>
        </v-main>
    </v-app>
</template>

<script setup lang="ts"></script>
