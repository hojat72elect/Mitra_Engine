import {defineConfig} from 'vite';
import {dirname, resolve} from 'path';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
    build: {
        lib: {
            entry: {
                engine: resolve(__dirname, 'src/engine/index.ts'),
                tiled_plugin: resolve(__dirname, 'src/tiled_plugin/index.ts'),
            },
            name: 'MitraEngine',
            formats: ['es'],
        },
        rollupOptions: {
            external: ['matter-js', 'pako', 'zod', 'zstddec', 'jsdom'],
            output: {
                entryFileNames: '[name].js',
                chunkFileNames: '[name].js',
                assetFileNames: '[name].[ext]',
            },
        },
        target: 'es2023',
        minify: false,
        copyPublicDir: false,
        emptyOutDir: false,
    },
    assetsInclude: ['**/*.glsl', '**/*.css', '**/*.png', '**/*.json'],
});
