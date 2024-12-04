<template>
  <footer>
    <div class="border-t border-gray-200 dark:border-gray-800">
      <UContainer class="py-8">
        <span
          class="block text-center text-sm text-gray-500 dark:text-gray-400">
          © qbix {{ new Date().getFullYear() }}, a web app assessment project
          made by
          <ULink
            to="https://github.com/qbix-tech"
            class="hover:text-primary underline underline-offset-4"
            target="_blank">
            @qbix-tech</ULink
          >.
        </span>
      </UContainer>
    </div>
  </footer>
</template>
