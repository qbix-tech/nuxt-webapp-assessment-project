<template>
  <UForm
    ref="form"
    :schema="schema"
    :state="state"
    class="space-y-4"
    @submit="onSubmit"
    @keyup.enter="() => form?.submit()">
    <UFormGroup label="Email" name="email" size="md" required>
      <UInput
        v-model="state.email"
        icon="heroicons:envelope"
        name="email"
        type="email"
        placeholder="Enter your email" />
    </UFormGroup>

    <UFormGroup label="Password" name="password" size="md" required>
      <UInput
        v-model="state.password"
        icon="heroicons:lock-closed"
        name="password"
        type="password"
        placeholder="Enter your password" />
    </UFormGroup>
  </UForm>
</template>

<script setup lang="ts">
import type { z } from "zod";
import type { FormSubmitEvent, Form } from "#ui/types";
import type { NuxtError } from "#app";
import { signInSchema as schema } from "~~/validation/auth";

const toast = useToast();

const state = reactive({
  email: undefined,
  password: undefined,
});

type Schema = z.output<typeof schema>;
const form = useTemplateRef<Form<Schema>>("form");
const loading = ref(false);
const { fetch: refreshSession } = useUserSession();

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
  try {
    loading.value = true;
    await $fetch("/api/auth/signin", {
      method: "POST",
      body: event.data,
    });
    await refreshSession();
    toast.add({
      title: "You are signed in.",
      description: "Welcome Back!",
      color: "primary",
    });

    const redirectPath = useCookie("redirect-path").value;
    useCookie("redirect-path").value = null;
    navigateTo(redirectPath || "/");
  } catch (error: unknown) {
    loading.value = false;

    const { data } = error as NuxtError<{ statusMessage: string }>;

    toast.add({
      title: "Sign Up Unsuccessful",
      description:
        data?.statusMessage || (error as Error)?.message || "An error occurred",
      color: "red",
    });
  }
};

defineExpose({ submit: () => form.value?.submit(), loading: loading });
</script>
