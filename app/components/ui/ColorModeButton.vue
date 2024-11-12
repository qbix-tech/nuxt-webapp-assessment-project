<template>
  <ClientOnly v-if="!colorMode?.forced">
    <UButton
      :aria-label="`Switch to ${isDark ? 'light' : 'dark'} mode`"
      :class="props.class"
      variant="ghost"
      color="gray"
      :icon="isDark ? 'heroicons:moon-16-solid' : 'heroicons:sun-16-solid'"
      @click="toggleColorMode" />

    <template #fallback>
      <div class="h-8 w-8" :class="props.class" />
    </template>
  </ClientOnly>
</template>

<script setup lang="ts">
const props = defineProps({
  class: { type: String, default: "" },
});

const colorMode = useColorMode();

const isDark = computed(() => colorMode.value === "dark");

const toggleColorMode = () => {
  if (colorMode.value === "light") {
    colorMode.preference = "dark";
  } else {
    colorMode.preference = "light";
  }
};
</script>
