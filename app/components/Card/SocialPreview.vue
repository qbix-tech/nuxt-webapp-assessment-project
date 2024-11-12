<template>
  <UCard>
    <div
      v-if="status === 'pending'"
      class="flex h-48 w-full items-center justify-center">
      <UIcon name="heroicons:arrow-path" class="h-5 w-5 animate-spin" />
    </div>
    <UTabs v-else :items="items">
      <template #web>
        <CardSocialPreviewWeb v-if="data" :data="data" />
      </template>
      <template #google>
        <CardSocialPreviewGoogle v-if="data" :data="data" />
      </template>
      <template #facebook>
        <CardSocialPreviewFacebook v-if="data" :data="data" />
      </template>
      <template #twitter>
        <CardSocialPreviewTwitter v-if="data" :data="data" />
      </template>
      <template #whatsapp>
        <CardSocialPreviewWhatsApp v-if="data" :data="data" />
      </template>
      <template #discord>
        <CardSocialPreviewDiscord v-if="data" :data="data" />
      </template>
    </UTabs>
  </UCard>
</template>

<script setup lang="ts">
const props = defineProps<{
  url: string;
}>();

const items = [
  { icon: "heroicons:globe-alt-solid", slot: "web", label: "" },
  { icon: "simple-icons:google", slot: "google", label: "" },
  { icon: "simple-icons:facebook", slot: "facebook", label: "" },
  { icon: "simple-icons:twitter", slot: "twitter", label: "" },
  { icon: "simple-icons:whatsapp", slot: "whatsapp", label: "" },
  { icon: "simple-icons:discord", slot: "discord", label: "" },
];

const { data, status } = useFetch("/api/url/get-meta-tags", {
  query: { url: props.url },
});
</script>
