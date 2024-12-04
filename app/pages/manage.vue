<template>
  <UContainer class="py-16">
    <div class="space-y-8 pb-16 pt-8">
      <h1 class="text-center text-4xl font-bold">
        All your links, QR codes and images in one place
      </h1>
    </div>

    <UCard :ui="{ body: { padding: '' } }">
      <UTable :columns="columns" :rows="rows">
        <template #url-data="{ row }">
          <UInput :model-value="row.url" readonly disabled size="lg" />
        </template>
        <template #type-data="{ row }">
          <ClientOnly>
            <UTooltip
              :text="row.type"
              :popper="{ placement: 'top' }"
              :ui="{ container: 'inline' }">
              <UIcon :name="iconMap(row.type)" class="mx-auto h-6 w-6" />
            </UTooltip>
          </ClientOnly>
        </template>
        <template #shortCode-data="{ row }">
          <UButtonGroup class="flex w-full" size="lg">
            <UInput
              :model-value="`${baseUrl}/to/${row.shortCode}`"
              readonly
              class="grow" />
            <UseClipboard
              v-slot="{ copy, copied }"
              :source="`${baseUrl}/to/${row.shortCode}`">
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
        </template>
        <template #createdAt-data="{ row }">
          {{ new Date(row.createdAt).toLocaleString() }}
        </template>
        <template #id-data="{ row }">
          <UButton color="gray" label="View" @click="view(row)" />
        </template>
      </UTable>
    </UCard>

    <USlideover v-model="showURLModal">
      <CardURL v-if="urlData" :data="urlData" @close="showURLModal = false" />
    </USlideover>
  </UContainer>
</template>

<script setup lang="ts">
import { UseClipboard } from "@vueuse/components";
import { URLType } from "~~/database/schema";

import type { InferSelectModel } from "drizzle-orm";
import type { SerializeObject } from "~~/node_modules/nitropack/types";

definePageMeta({
  middleware: ["auth"],
});

useSeoMeta({
  title: "Manage",
});

const { data } = await useAsyncData("manage", () =>
  useRequestFetch()("/api/urls", {
    query: { order: "desc" },
  }),
);

const baseUrl = useRuntimeConfig().public.baseUrl;
const iconMap = (type: URLType) => {
  switch (type) {
    case URLType.link:
      return "heroicons:link-16-solid";
    case URLType.qrcode:
      return "heroicons:qr-code-16-solid";
    case URLType.image:
      return "heroicons:photo-solid";
  }
};

const rows = computed(() => {
  return data.value ?? [];
});
const columns = [
  { label: "Destination", key: "url" },
  { label: "Type", key: "type" },
  { label: "Short URL", key: "shortCode" },
  { label: "Created At", key: "createdAt" },
  { label: "", key: "id" },
];

const showURLModal = ref(false);
const urlData = ref<SerializeObject<
  InferSelectModel<typeof tables.url>
> | null>(null);

const view = (row: SerializeObject<InferSelectModel<typeof tables.url>>) => {
  urlData.value = row;
  showURLModal.value = true;
};
</script>
