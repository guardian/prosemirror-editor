import { defineConfig } from "vite";

export default defineConfig({
  esbuild: {
    logOverride: { "this-is-undefined-in-esm": "silent" }
  },
  build: {
    outDir: "dist/",
    sourcemap: true,
    lib: {
      entry: "src/ts/index.ts",
      formats: ["cjs", "es"],
      fileName: "index"
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
  }
});
