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
          <h1 class="mt-4 text-xl font-bold">Sign In</h1>
          <span class="mt-1.5 block">Welcome Back!</span>
        </div>
      </div>
    </template>

    <FormAuthSignIn ref="form" />

    <template #footer>
      <div class="space-y-4">
        <UButton
          type="submit"
          color="black"
          size="lg"
          block
          :loading="form?.loading"
          @click="form?.submit">
          Sign In
        </UButton>
        <span class="mt-1.5 block text-center text-sm">
          Don't have an account?
          <ULink
            to="/auth/signup"
            class="text-primary-500 dark:text-primary-400 hover:dark:text-primary-500 hover:text-primary-600 font-medium">
            Sign Up
          </ULink>
        </span>
      </div>
    </template>
  </UCard>
</template>

<script setup lang="ts">
useSeoMeta({
  title: "Sign In",
});

const form = useTemplateRef("form");
</script>
