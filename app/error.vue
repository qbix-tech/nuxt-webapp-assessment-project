<template>
  <div
    class="bg-background scroll-smooth subpixel-antialiased dark:antialiased">
    <main>
      <UContainer>
        <div class="flex min-h-[100svh] flex-col items-center justify-center">
          <span
            class="text-primary-500 dark:text-primary-400 text-2xl font-semibold">
            {{ error?.statusCode || 404 }}
          </span>
          <h1
            class="text-2xl font-bold text-gray-900 sm:text-4xl dark:text-white">
            {{ error?.name || error?.statusMessage || "An error occurred" }}
          </h1>
          <p class="mt-6 text-center text-gray-500 dark:text-gray-400">
            {{
              error?.message &&
              error.message !== (error.name || error.statusMessage)
                ? error.message
                : "This is not the page you're looking for."
            }}
          </p>
          <div class="mt-10 flex items-center justify-center gap-x-6">
            <UButton
              label="Go back home"
              color="black"
              size="lg"
              @click="handleError" />
          </div>
        </div>
      </UContainer>
    </main>
    <UNotifications />
  </div>
</template>

<script setup lang="ts">
import type { PropType } from "vue";
import type { NuxtError } from "#app";

defineProps({
  error: {
    type: Object as PropType<NuxtError>,
    required: true,
  },
});

const handleError = () => clearError({ redirect: "/" });

useSeoMeta({
  title: "Page not found",
  description: "We are sorry but this page could not be found.",
});

useHead({
  htmlAttrs: {
    lang: "en",
  },
});
</script>
