<template>
  <div class="space-y-2">
    <img
      v-if="props.data.image"
      :src="props.data.image"
      :alt="props.data.title || undefined"
      class="mx-auto w-full rounded-lg" />
    <PlaceholderImage v-else class="h-48 w-full" />
    <span class="block text-sm">{{ props.data.title }}</span>
    <span
      class="line-clamp-2 text-sm font-light text-gray-500 dark:text-gray-400"
      >{{ props.data.description }}</span
    >
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  data: {
    title: string | null;
    description: string | null;
    image: string | null;
    favicon: string | null;
    hostname: string | null;
    raw: Record<string, string>;
  };
}>();
</script>
