<template>
  <div
    class="bg-background scroll-smooth subpixel-antialiased dark:antialiased">
    <NuxtRouteAnnouncer />
    <NuxtLoadingIndicator />

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <UNotifications />
  </div>
</template>

<script setup lang="ts">
const colorMode = useColorMode();
const color = computed(() =>
  colorMode.value === "dark" ? "#171717" : "white",
);

useHead({
  meta: [
    { charset: "utf-8" },
    { name: "viewport", content: "width=device-width, initial-scale=1" },
    { key: "theme-color", name: "theme-color", content: color },
  ],
  link: [
    {
      rel: "icon",
      type: "image/png",
      href: "/favicon-96x96.png",
      sizes: "96x96",
    },
    { rel: "shortcut icon", href: "/favicon.ico" },
    {
      rel: "apple-touch-icon",
      sizes: "180x180",
      href: "/apple-touch-icon.png",
    },
    { rel: "manifest", href: "/site.webmanifest" },
  ],
  htmlAttrs: {
    lang: "en",
  },
});

useSeoMeta({
  titleTemplate: "%s - qbix",
  description:
    "At qbix, our journey began with a vision to redefine excellence in the world of software engineering. Founded by a diverse team of experts with a shared passion for innovation, we set out on a mission to disrupt the landscape of financial, precious metal trading, e-commerce and sales generation platforms.",
  ogImage: `${useRuntimeConfig().public.baseUrl}/social-card.png`,
  twitterImage: `${useRuntimeConfig().public.baseUrl}/social-card.png`,
  twitterCard: "summary_large_image",
});
</script>

<style>
:root {
  --header-height: 4rem;
  --ui-background: 255 255 255;
  --ui-foreground: var(--color-gray-700);
}

.dark {
  --ui-background: var(--color-gray-900);
  --ui-foreground: var(--color-gray-200);
}

.bg-background {
  background-color: rgb(var(--ui-background));
}

.bg-background\/75 {
  background-color: rgb(var(--ui-background) / 0.75);
}
</style>
