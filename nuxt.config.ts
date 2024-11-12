import PluginVue from "@vitejs/plugin-vue";

export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4,
  },

  compatibilityDate: "2024-04-03",

  devtools: { enabled: true },

  modules: [
    "@nuxt/ui",
    "@nuxt/content",
    "@nuxt/image",
    "@nuxt/eslint",
    "@vueuse/nuxt",
    "nuxt-auth-utils",
    "@nuxt/fonts",
  ],

  app: {
    pageTransition: { name: "page", mode: "out-in" },
    layoutTransition: { name: "layout", mode: "out-in" },
  },

  components: [{ path: "~/components/ui", pathPrefix: false }, "~/components"],

  runtimeConfig: {
    public: {
      baseUrl: process.env.BASE_URL,
    },
    session: {
      name: "nuxt-webapp-assessment-session",
      maxAge: 60 * 60 * 24 * 7,
    },
    storage: {
      buckets: {
        avatar: {
          public: true,
          allowedMimeTypes: ["image"],
          maxSize: "1MB",
        },
        image: {
          public: true,
          allowedMimeTypes: ["image"],
          maxSize: "10MB",
        },
      },
    },
  },

  nitro: {
    rollupConfig: {
      // @ts-expect-error https://github.com/vitejs/vite-plugin-vue/issues/422
      plugins: [PluginVue()],
    },
  },
});
