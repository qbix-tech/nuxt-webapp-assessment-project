<template>
  <div>
    <AppHeader />

    <main class="min-h-[calc(100vh-var(--header-height))]">
      <slot />
    </main>

    <AppFooter />
  </div>
</template>

<script setup lang="ts"></script>
