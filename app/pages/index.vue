<template>
  <UContainer class="py-16">
    <div class="space-y-8 pb-16 pt-8">
      <h1 class="text-center text-4xl font-bold">
        Get the most out of every link or image you share
      </h1>
      <span class="block text-center text-lg">
        Create short links, QR codes or upload images, that you can share and
        track!
      </span>
    </div>

    <div>
      <UTabs
        :items="options"
        :ui="{
          wrapper: 'space-y-4',
          list: {
            tab: {
              height: 'h-12',
              size: 'text-md',
              icon: 'w-6 h-6',
              font: 'font-bold',
            },
            height: 'h-16',
            padding: 'p-2',
          },
        }">
        <template #short-link>
          <UCard>
            <template #header>
              <div class="inline-flex items-center gap-x-2">
                <UIcon name="heroicons:link-16-solid" class="h-6 w-6" />
                <h2 class="text-lg font-bold">Shorten a long link</h2>
              </div>
            </template>
            <FormURLShortLink ref="shortLinkForm" @success="onSuccess" />
            <template #footer>
              <div class="flex justify-end">
                <UButton
                  class="font-bold"
                  color="black"
                  size="lg"
                  :loading="shortLinkForm?.loading"
                  @click="shortLinkForm?.submit">
                  Shorten your Link
                </UButton>
              </div>
            </template>
          </UCard>
        </template>
        <template #qr-code>
          <UCard>
            <template #header>
              <div class="inline-flex items-center gap-x-2">
                <UIcon name="heroicons:qr-code-16-solid" class="h-6 w-6" />
                <h2 class="text-lg font-bold">Create a QR Code</h2>
              </div>
            </template>
            <FormURLQRCode ref="qrCodeForm" @success="onSuccess" />
            <template #footer>
              <div class="flex justify-end">
                <UButton
                  class="font-bold"
                  color="black"
                  size="lg"
                  :loading="qrCodeForm?.loading"
                  @click="qrCodeForm?.submit">
                  Create your QR Code
                </UButton>
              </div>
            </template>
          </UCard>
        </template>
        <template #image>
          <UCard>
            <template #header>
              <div class="inline-flex items-center gap-x-2">
                <UIcon name="heroicons:photo-solid" class="h-6 w-6" />
                <h2 class="text-lg font-bold">Upload and Share Image</h2>
              </div>
            </template>
            <FormURLImage ref="imageForm" @success="onSuccess" />
            <template #footer>
              <div class="flex justify-end">
                <UButton
                  class="font-bold"
                  color="black"
                  size="lg"
                  :loading="imageForm?.loading"
                  @click="imageForm?.submit">
                  Upload your Image
                </UButton>
              </div>
            </template>
          </UCard>
        </template>
      </UTabs>
    </div>

    <USlideover v-model="showURLModal">
      <CardURL v-if="urlData" :data="urlData" @close="showURLModal = false" />
    </USlideover>
  </UContainer>
</template>

<script setup lang="ts">
import type {
  FormURLShortLink,
  FormURLQRCode,
  FormURLImage,
} from "#build/components";
import type { InferSelectModel } from "drizzle-orm";
import type { SerializeObject } from "~~/node_modules/nitropack/types";

useSeoMeta({
  title: "Home",
});

const options = [
  {
    label: "Short Link",
    icon: "heroicons:link-16-solid",
    slot: "short-link",
  },
  {
    label: "QR Code",
    icon: "heroicons:qr-code-16-solid",
    slot: "qr-code",
  },
  {
    label: "Image",
    icon: "heroicons:photo-solid",
    slot: "image",
  },
];

const shortLinkForm = useTemplateRef("shortLinkForm");
const qrCodeForm = useTemplateRef("qrCodeForm");
const imageForm = useTemplateRef("imageForm");

const showURLModal = ref(false);
const urlData = ref<SerializeObject<
  InferSelectModel<typeof tables.url>
> | null>(null);

const onSuccess = (
  data: SerializeObject<InferSelectModel<typeof tables.url>>,
) => {
  urlData.value = data;
  showURLModal.value = true;
};
</script>
