import { defineConfig } from 'vitest/config';

export default defineConfig({
    resolve: {
        alias: {
            '@': '/src',
        },
    },
    test: {
        // 必要に応じて追加の設定
    },
});
