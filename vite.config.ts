import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, "index.html"),
                weather: resolve(__dirname, "weather.html"),
                music: resolve(__dirname, "music.html"),
            },
        },
    },
});
