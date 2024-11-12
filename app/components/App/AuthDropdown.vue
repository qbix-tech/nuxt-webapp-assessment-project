<template>
  <UDropdown
    mode="hover"
    :items="items"
    :ui="{ width: 'w-full', item: { disabled: 'cursor-text select-text' } }"
    :popper="{ strategy: 'absolute', placement: 'bottom' }"
    class="w-full">
    <button
      class="flex w-full items-center gap-x-2 rounded-lg p-1 text-left hover:bg-gray-100 dark:hover:bg-white/10">
      <UAvatar
        size="sm"
        :alt="user.name"
        :ui="{
          rounded: 'rounded-md',
          size: {
            sm: 'w-9 h-9',
          },
        }"
        class="ring-1 ring-gray-200 dark:ring-white/20" />
      <div class="min-w-0">
        <span
          class="block truncate text-sm font-medium text-gray-950 dark:text-white">
          {{ user.name }}
        </span>
        <span
          class="block truncate text-xs font-normal text-gray-500 dark:text-gray-400">
          {{ user.email }}
        </span>
      </div>
    </button>
  </UDropdown>
</template>

<script setup>
const { user, clear } = useUserSession();
const toast = useToast();
const items = [
  [
    {
      label: "Manage",
      icon: "heroicons:heart",
      to: "/manage",
    },
  ],
  [
    {
      label: "Sign out",
      icon: "heroicons:arrow-left-on-rectangle",
      click: () => signOut(),
    },
  ],
];

async function signOut() {
  await clear();
  toast.add({
    title: "Farewell",
    description: "You have been signed out successfully.",
  });
  return navigateTo("/");
}
</script>
