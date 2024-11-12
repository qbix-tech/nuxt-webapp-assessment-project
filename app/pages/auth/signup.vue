<template>
  <UCard
    :ui="{
      base: 'w-full max-w-sm',
      divide: 'divide-y-0',
      header: { padding: 'pb-0' },
    }">
    <template #header>
      <div class="space-y-8">
        <ULink to="/">
          <AppLogo class="h-8" />
        </ULink>
        <div>
          <h1 class="mt-4 text-xl font-bold">Sign Up</h1>
          <span class="mt-1.5 block text-sm">
            Complete the form below to create a new user account. Have
            registered?
            <ULink
              to="/auth/signin"
              class="text-primary-500 dark:text-primary-400 hover:dark:text-primary-500 hover:text-primary-600 font-medium">
              Sign In
            </ULink>
          </span>
        </div>
      </div>
    </template>

    <FormAuthSignUp ref="form" />

    <template #footer>
      <UButton
        label="Sign Up"
        color="black"
        size="lg"
        :loading="form?.loading"
        block
        @click="form?.submit" />
    </template>
  </UCard>
</template>

<script setup lang="ts">
useSeoMeta({
  title: "Sign Up",
});

const form = useTemplateRef("form");
</script>
