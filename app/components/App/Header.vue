<template>
  <header
    class="bg-background/75 sticky top-0 z-50 -mb-px border-b border-gray-200 backdrop-blur dark:border-gray-800">
    <UContainer
      as="nav"
      class="flex h-[--header-height] items-center justify-between gap-3">
      <div class="flex items-center gap-1.5">
        <ULink to="/" aria-label="Logo">
          <AppLogo class="h-7" />
        </ULink>
      </div>

      <div class="flex items-center justify-end gap-4">
        <ColorModeButton />
        <AuthState v-slot="{ loggedIn }">
          <UButton
            v-if="!loggedIn"
            to="/auth/signup"
            label="Sign Up"
            color="black"
            :ui="{ rounded: 'rounded-full' }" />
          <UButton
            v-if="!loggedIn"
            to="/auth/signin"
            color="white"
            label="Sign In"
            :ui="{ rounded: 'rounded-full' }" />
          <template v-else>
            <div class="max-w-48">
              <AppAuthDropdown />
            </div>
          </template>
        </AuthState>
      </div>
    </UContainer>
  </header>
</template>
