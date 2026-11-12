import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import inertiacore from "@inertiacore/vite-plugin";

export default defineConfig({
    plugins: [
        inertiacore({
            input: ["src/App.tsx"],
            refresh: true,
        }),
        react(),
    ],
    resolve: {
        alias: {
            "@": "/src",
        },
    },
    build: {
        emptyOutDir: true,
    },
});
