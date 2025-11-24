import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, "index.html"),
                weather: resolve(__dirname, "weather.html"),
                music: resolve(__dirname, "music.html"),
                podcast: resolve(__dirname, "podcast.html"),
            },
        },
    },
    server: {
        host: "127.0.0.1",
        port: 5173,
        strictPort: true,
        allowedHosts: ["adirondack.local"],
    },
});
