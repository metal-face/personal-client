/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";
import { md3 } from "vuetify/blueprints";

// Composables
import { createVuetify } from "vuetify";
import { aliases, mdi } from "vuetify/iconsets/mdi";
// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
    blueprint: md3,
    icons: {
        defaultSet: "mdi",
        aliases,
        sets: {
            mdi,
        },
    },
    theme: {
        defaultTheme: "dark",
        themes: {
            light: {
                colors: {
                    primary: "#1867C0",
                    secondary: "#5CBBF6",
                },
            },
            dark: {
                colors: {
                    primary: "#1e1e1e",
                    secondary: "#4e4e4e",
                },
            },
        },
    },
});
