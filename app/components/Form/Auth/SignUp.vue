<template>
  <UForm
    ref="form"
    :schema="schema"
    :state="state"
    class="space-y-4"
    @submit="onSubmit"
    @keyup.enter="() => form?.submit()">
    <UFormGroup label="Name" name="name" size="md" required>
      <UInput
        v-model="state.name"
        icon="heroicons:user-circle"
        name="name"
        type="text"
        placeholder="Enter your name" />
    </UFormGroup>

    <UFormGroup label="Email" name="email" size="md" required>
      <UInput
        v-model="state.email"
        icon="heroicons:envelope"
        name="email"
        type="email"
        placeholder="Enter your email" />
    </UFormGroup>

    <UFormGroup label="New Password" name="newPassword" size="md" required>
      <UInput
        v-model="state.newPassword"
        icon="heroicons:lock-closed"
        name="newPassword"
        autocomplete="new-password"
        type="password"
        placeholder="Enter your preferred password" />
    </UFormGroup>

    <UFormGroup
      label="Confirm Password"
      name="confirmPassword"
      size="md"
      required>
      <UInput
        v-model="state.confirmPassword"
        icon="heroicons:lock-closed"
        name="confirmPassword"
        autocomplete="confirm-new-password"
        type="password"
        placeholder="Enter again to confirm" />
    </UFormGroup>
  </UForm>
</template>

<script setup lang="ts">
import type z from "zod";
import type { FormSubmitEvent, Form } from "#ui/types";
import type { NuxtError } from "#app";
import { signUpSchema as schema } from "~~/validation/auth";

const toast = useToast();

const state = reactive({
  email: undefined,
  name: undefined,
  newPassword: undefined,
  confirmPassword: undefined,
});

type Schema = z.output<typeof schema>;
const form = useTemplateRef<Form<Schema>>("form");
const loading = ref(false);
const { fetch: refreshSession } = useUserSession();

const beforeSubmit = () => {
  // to ensure zod superRefine gets triggered
  form.value?.validate();
};

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
  beforeSubmit(); // will throw

  try {
    loading.value = true;
    await $fetch("/api/auth/signup", {
      method: "POST",
      body: event.data,
    });
    await refreshSession();
    toast.add({
      title: "Sign Up Successful",
      description: "Please check your email to verify your account",
      color: "primary",
    });
    navigateTo("/");
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
