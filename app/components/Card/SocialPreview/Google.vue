<template>
  <div class="space-y-4">
    <div class="flex items-center gap-x-2">
      <UAvatar v-if="props.data.favicon" :src="props.data.favicon" size="xs" />
      <span class="text-sm dark:text-gray-200">{{ props.data.hostname }}</span>
    </div>
    <div>
      <p class="text-[#1a0dab] dark:text-[#99c3ff]">
        {{ props.data.title }}
      </p>
      <p class="text-[#474747]dark:text-[#bfbfbf] line-clamp-2 text-sm">
        {{ props.data.description }}
      </p>
    </div>
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
