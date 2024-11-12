<template>
  <UForm ref="form" :state="state" :schema="schema" @submit="onSubmit">
    <UFormGroup
      label="Enter your QR Code destination"
      name="url"
      size="xl"
      :ui="{ container: 'mt-3' }">
      <UInput
        v-model="state.url"
        type="text"
        placeholder="https://example.com/my-long-url" />
    </UFormGroup>
  </UForm>
</template>

<script setup lang="ts">
import { URLType } from "~~/database/schema";
import { createQRCodeSchema as schema } from "~~/validation/url";

import type z from "zod";
import type { InferSelectModel } from "drizzle-orm";
import type { SerializeObject } from "~~/node_modules/nitropack/types";
import type { FormSubmitEvent, Form } from "#ui/types";
import type { NuxtError } from "#app";

const toast = useToast();

const emits = defineEmits<{
  success: [data: SerializeObject<InferSelectModel<typeof tables.url>>];
}>();

const state = reactive({
  url: undefined,
  type: URLType.qrcode,
});

type Schema = z.output<typeof schema>;
const form = useTemplateRef<Form<Schema>>("form");
const loading = ref(false);

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
