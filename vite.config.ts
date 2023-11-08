// Plugins
import vue from "@vitejs/plugin-vue";
import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";

// Utilities
import { defineConfig } from "vite";
import { fileURLToPath, URL } from "node:url";
import svgLoader from "vite-svg-loader";
import { splitVendorChunkPlugin } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue({
            template: { transformAssetUrls },
        }),
        // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin
        vuetify({
            autoImport: true,
        }),
        svgLoader(),
        splitVendorChunkPlugin(),
    ],

    define: { "process.env": {} },
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
        },
        extensions: [".js", ".json", ".jsx", ".mjs", ".ts", ".tsx", ".vue"],
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    vuetify: ["vuetify"],
                    highlight: ["highlight.js"],
                    mermaid: ["mermaid"],
                    cropperjs: ["cropperjs"],
                },
            },
        },
    },
    server: {
        cors: { origin: true },
        port: 3000,
        proxy: {
            "/api": {
                target: "https://localhost:10000",
                changeOrigin: true,
                secure: false,
                ws: true,
            },
        },
    },
});
