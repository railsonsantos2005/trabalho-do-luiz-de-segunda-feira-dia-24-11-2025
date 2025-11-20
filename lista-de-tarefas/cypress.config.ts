import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: "http://localhost:5173",
    specPattern: "cypress/e2e/**/*.spec.{js,ts,jsx,tsx}",
  },

  component: {
    devServer: {
      framework: "vue",
      bundler: "vite",
    },
  },
});
