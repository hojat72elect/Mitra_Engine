import {defineConfig} from 'vite';
import {resolve} from 'path';
import {existsSync, readdirSync} from 'fs';

// Automatically discover all example HTML files in the examples/ directory.
// Each example should have its own folder: examples/<name>/index.html
function discoverExamples(): Record<string, string> {
    const examplesDir = resolve(import.meta.dirname, 'examples');
    const inputs: Record<string, string> = {};

    if (!existsSync(examplesDir)) {
        return inputs;
    }

    for (const entry of readdirSync(examplesDir, {withFileTypes: true})) {
        if (entry.isDirectory()) {
            const htmlPath = resolve(examplesDir, entry.name, 'index.html');
            if (existsSync(htmlPath)) {
                inputs[entry.name] = htmlPath;
            }
        }
    }

    return inputs;
}

export default defineConfig({
    build: {
        rollupOptions: {
            input: discoverExamples(),
        },
    },
});
