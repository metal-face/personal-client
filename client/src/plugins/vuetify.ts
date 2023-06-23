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
import { createVuetify, ThemeDefinition } from "vuetify";
import { aliases, mdi } from "vuetify/iconsets/mdi";
import colors from "vuetify/lib/util/colors";

const customDarkTheme: ThemeDefinition = {
    dark: true,
    colors: {
        primary: colors.grey.darken4,
        secondary: colors.pink.darken1,
        background: colors.shades.black,
        surface: colors.grey.darken3,
        error: colors.red.accent1,
        info: colors.blue.accent1,
        success: colors.green.accent2,
        warning: colors.yellow.accent1,
    }
}

const customLightTheme: ThemeDefinition = {
    dark: false,
    colors: {
        primary: colors.shades.black,
        secondary: colors.pink.lighten1,
        background: colors.shades.white,
        surface: colors.grey.lighten5,
        error: colors.red.accent1,
        info: colors.blue.accent1,
        success: colors.green.accent2,
        warning: colors.yellow.accent1,
    }
}
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
        defaultTheme: 'customDarkTheme',
        themes: {
            customDarkTheme,
            customLightTheme,
        },
    },
});
