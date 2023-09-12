import { defineConfig } from "vite";
import packageJson from "./package.json";
import react from "@vitejs/plugin-react";

export default defineConfig({
  optimizeDeps: {
    include: ['linked-dep'],
  },
  plugins: [
    react({
      jsxImportSource: "preact",
    })
  ],
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
    // rollupOptions: {
    //   // We do not bundle any dependencies specified by node_modules –
    //   // they should be bundled by the application using this module.
    //   external: Object.keys(packageJson.dependencies)
    // },
    commonjsOptions: {
      include: [/linked-dep/, /node_modules/],
    },
  }
});
