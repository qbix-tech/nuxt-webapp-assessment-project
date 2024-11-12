import { defineVitestConfig } from "@nuxt/test-utils/config";

export default defineVitestConfig({
  test: {
    environment: "nuxt",
    exclude: ["**/node_modules/**/*"],
    reporters: process.env.CI ? ["verbose", "github-actions"] : ["verbose"],
  },
});
