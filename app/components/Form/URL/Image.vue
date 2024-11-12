<template>
  <UForm ref="form" :state="state" :schema="schema" @submit="onSubmit">
    <UFormGroup
      label="Upload your image"
      name="imageObject"
      size="xl"
      :ui="{ container: 'mt-3' }">
      <UInput
        ref="fileRef"
        type="file"
        icon="heroicons:photo"
        accept=".jpg, .jpeg, .png, .gif"
        :loading="isUploading"
        @change="onFileChange" />
      <UCard v-if="objectUrl" class="mt-4">
        <img
          :src="objectUrl"
          alt="Uploaded Photo"
          class="mx-auto w-2/3 rounded-lg" />
      </UCard>
    </UFormGroup>
  </UForm>
</template>

<script setup lang="ts">
import { URLType } from "~~/database/schema";
import { createImageSchema as schema } from "~~/validation/url";

import type z from "zod";
import type { InferSelectModel } from "drizzle-orm";
import type { SerializeObject } from "~~/node_modules/nitropack/types";
import type { FormSubmitEvent, Form } from "#ui/types";
import type { NuxtError } from "#app";

const toast = useToast();

const emits = defineEmits<{
  success: [data: SerializeObject<InferSelectModel<typeof tables.url>>];
}>();

const state = reactive<Partial<Schema>>({
  imageObject: undefined,
  type: URLType.image,
});

type Schema = z.output<typeof schema>;
const form = useTemplateRef<Form<Schema>>("form");
const loading = ref(false);
const isUploading = ref(false);
const objectUrl = ref<string | undefined>(undefined);

const onFileChange = (e: File[]) => {
  const files = e;
  const file = files && files.length ? files[0] : undefined;

  if (!file) {
    return;
  }
  // check if file is image
  if (!file.type.startsWith("image/")) {
    toast.add({
      title: "Invalid file type",
      description: "Please select an image file.",
      icon: "heroicons:information-circle",
    });
    return;
  }

  // compress image by resizing then uploads it
  compressImage(file, 0.8).then((file) => {
    const formData = new FormData();
    formData.append("file", file);

    isUploading.value = true;

    $fetch("/api/storage/upload/image", {
      method: "PUT",
      body: formData,
    })
      .then(({ key }) => {
        objectUrl.value = URL.createObjectURL(file);
        state.imageObject = key;
      })
      .catch((error: unknown) => {
        const { data } = error as NuxtError<{ statusMessage: string }>;

        toast.add({
          title: "File Upload Failed",
          description:
            data?.statusMessage ||
            (error as Error)?.message ||
            "An error occurred",
          color: "red",
        });
      })
      .finally(() => {
        isUploading.value = false;
      });
  });
};

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
  try {
    loading.value = true;
    const data = await $fetch("/api/url", {
      method: "POST",
      body: event.data,
    });
    emits("success", data);
  } catch (error: unknown) {
    loading.value = false;

    const { data } = error as NuxtError<{ statusMessage: string }>;

    toast.add({
      title: "Unsuccessful",
      description:
        data?.statusMessage || (error as Error)?.message || "An error occurred",
      color: "red",
    });
  } finally {
    loading.value = false;
  }
};

defineExpose({ submit: () => form.value?.submit(), loading: loading });
</script>
