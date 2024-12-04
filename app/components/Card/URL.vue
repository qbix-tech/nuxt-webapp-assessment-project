<template>
  <UCard
    class="flex flex-1 flex-col"
    :ui="{
      base: 'h-[100dvh]',
      body: { base: 'flex-1 overflow-y-auto' },
      ring: '',
      divide: 'divide-y divide-gray-100 dark:divide-gray-800',
    }">
    <template #header>
      <div class="flex justify-between gap-4">
        <span class="text-lg font-bold text-gray-700 dark:text-gray-300">
          Your {{ title }}
        </span>
        <UButton
          color="gray"
          variant="ghost"
          icon="heroicons:x-mark"
          class="-my-1"
          @click="emits('close')" />
      </div>
    </template>

    <div class="space-y-4">
      <UFormGroup
        v-if="props.data.type !== URLType.image"
        label="Destination URL"
        :ui="{ container: 'mt-2' }">
        <UInput :model-value="props.data.url" readonly disabled size="lg" />
      </UFormGroup>
      <UFormGroup v-else label="Image" :ui="{ container: 'mt-2' }">
        <UCard>
          <img
            :src="shortLink"
            :alt="props.data.shortCode"
            class="mx-auto w-2/3 rounded-lg" />
        </UCard>
      </UFormGroup>
      <UFormGroup
        :label="props.data.type === URLType.image ? 'Link' : 'Short Link'"
        :ui="{ container: 'mt-2' }">
        <UButtonGroup class="flex w-full" size="lg">
          <UInput :model-value="shortLink" readonly class="grow" />
          <UseClipboard v-slot="{ copy, copied }" :source="shortLink">
            <UButton
              color="gray"
              :icon="
                copied
                  ? 'heroicons:check-badge'
                  : 'heroicons:clipboard-document'
              "
              @click="copy()" />
          </UseClipboard>
        </UButtonGroup>
      </UFormGroup>
      <UFormGroup
        v-if="props.data.type !== URLType.image"
        label="QR Code"
        :ui="{ container: 'mt-2' }">
        <UCard>
          <ClientOnly>
            <img :src="qrcode" alt="QR Code" class="mx-auto w-2/3 rounded-lg" />
          </ClientOnly>
          <template #footer>
            <UButton
              color="gray"
              label="Download"
              icon="heroicons:cloud-arrow-down"
              @click="downloadQRCode" />
          </template>
        </UCard>
      </UFormGroup>
      <UFormGroup
        v-if="props.data.type !== URLType.image"
        label="Social Preview"
        :ui="{ container: 'mt-2' }">
        <CardSocialPreview :url="props.data.url" />
      </UFormGroup>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import { URLType } from "~~/database/schema";
import { UseClipboard } from "@vueuse/components";
import { useQRCode } from "@vueuse/integrations/useQRCode";
import type { InferSelectModel } from "drizzle-orm";
import type { SerializeObject } from "~~/node_modules/nitropack/types";

const props = defineProps<{
  data: SerializeObject<InferSelectModel<typeof tables.url>>;
}>();

const emits = defineEmits<{
  close: [];
}>();

const title = computed(() => {
  switch (props.data.type) {
    case URLType.link:
      return "Short Link";
    case URLType.qrcode:
      return "QR Code";
    case URLType.image:
      return "Image";
    default:
      return "Unknown";
  }
});
const baseUrl = useRuntimeConfig().public.baseUrl;
const shortLink = computed(() => `${baseUrl}/to/${props.data.shortCode}`);

const qrcode = useQRCode(shortLink);
const downloadQRCode = () => {
  const a = document.createElement("a");
  a.href = qrcode.value;
  a.download = props.data.shortCode + ".png";
  a.click();
};
</script>
