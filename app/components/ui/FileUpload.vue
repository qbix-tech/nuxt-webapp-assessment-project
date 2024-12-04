<!-- eslint-disable vue/html-self-closing -->
<!-- Usage: <FileUpload :accepts="['image', 'pdf', 'png']" @change="handleChange" /> -->

<template>
  <div ref="dropZoneRef" class="w-full">
    <label>
      <input ref="inputRef" type="file" class="hidden" @change="onChange" />
    </label>
  </div>
</template>

<script setup lang="ts">
const emits = defineEmits<{
  change: [{ files: File[] }];
}>();

const dropZoneRef = ref<HTMLElement | null>(null);

const onChange = (event: Event) => {
  const files = (event.target as HTMLInputElement).files;
  if (files) {
    emits("change", { files });
  }
};
</script>
