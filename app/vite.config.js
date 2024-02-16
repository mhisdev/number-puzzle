import { defineConfig } from 'vite';
import { viteSingleFile } from "vite-plugin-singlefile"

export default defineConfig({
    server: {
        port: 8080,
        host: true
    },
    plugins: [
        viteSingleFile()
    ]
});