// vite.config.js
const path = require("path");
import react from "@vitejs/plugin-react";
const { defineConfig } = require("vite");

module.exports = defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: path.resolve(__dirname, "lib/index.js"),
      name: "@rvision/use-form",
      fileName: (format) => `index.${format}.js`,
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ["react"],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          react: "react",
        },
      },
    },
  },
});
