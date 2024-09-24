import { defineConfig } from "tsup";

export default defineConfig({
    entry: [
        "src/index.ts",
        "src/timing/index.ts",
        "src/scheduler/index.ts",
        "src/eth/index.ts"
    ],
    format: ["cjs", "esm"],
    splitting: false,
    sourcemap: true,
    clean: true,
    dts: true,
});
