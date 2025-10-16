import {defineConfig} from "vite";
import {resolve} from "path";
import tailwindcss from '@tailwindcss/vite';
import react from "@vitejs/plugin-react";
import django from "django-vite-plugin"

export default defineConfig({
    root: resolve(__dirname, "isp/resources/src"),
    base: "/static/",
    publicDir: resolve(__dirname, "isp/resources/public"),
    resolve: {
        alias: {
            "@": resolve(__dirname, "isp/resources/src"),
        },
    },
    plugins: [
        // django({
        //     input: ['isp/static/src/css/app.css', 'isp/static/src/main.tsx'],
        //     pyPath:".venv/bin/python"
        // }),
        react({include: '**/*.disabled',}),
        tailwindcss(),],
    build: {
        outDir: resolve("./isp/static/dist"),
        assetsDir: "assets",
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
                assetFileNames: (assetInfo) => {
                    const rand = Math.random().toString(36).substring(2, 12);
                    const info = assetInfo.name ? assetInfo.name.split('.') : ['asset'];
                    const ext = info[info.length - 1];
                    return `assets/f2c-${rand}.${ext}`;
                },
            }
        },
    },
    assetsInclude: ['**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.svg', '**/*.gif'],
    css: {
        modules: {
            generateScopedName:
            // process.env.NODE_ENV !== 'production'
                '[hash:base64:6]' // minified short class names
            // : '[name]__[local]___[hash:base64:5]' // readable in dev
        }
    },
    server: {
    host: '0.0.0.0',
    port: 5173,
    cors: {
      origin: 'http://192.168.10.9:8000', // Django origin
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type'],
    }
  }
});
