import {defineConfig} from "vite";
import {resolve} from "path";
import tailwindcss from '@tailwindcss/vite';
import react from "@vitejs/plugin-react";
import django from "django-vite-plugin"

export default defineConfig({
    root: resolve("./isp/resources/src"),
    base: "/static/",
    plugins: [
        // django({
        //     input: ['isp/static/src/css/app.css', 'isp/static/src/main.tsx'],
        //     pyPath:".venv/bin/python"
        // }),
        react({ include: '**/*.disabled',}),
        tailwindcss()],
    build: {
        outDir: resolve("./isp/static/dist"),
        assetsDir: "",
        manifest: true,
        emptyOutDir: true,
        rollupOptions: {
            // Overwrite default .html entry to main.ts in the static directory
            input: resolve("./isp/resources/src/main.tsx"),
            output: {
                entryFileNames: () => {
                    const rand = Math.random().toString(36).substring(2, 12);
                    return `f2c-${rand}.js`;
                },
                chunkFileNames: () => {
                    const rand = Math.random().toString(36).substring(2, 12);
                    return `f2c-${rand}.js`;
                },
                // Randomize asset file names (CSS, images, etc.)
                assetFileNames: () => {
                    const rand = Math.random().toString(36).substring(2, 12);
                    return `f2c-${rand}.[ext]`;
                },
            }
        },
    },
});
