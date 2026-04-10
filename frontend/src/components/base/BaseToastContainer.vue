<template>
  <teleport to="body">
    <div
      class="pointer-events-none fixed inset-x-4 bottom-4 z-[9999] flex justify-end sm:inset-x-auto sm:right-6 sm:bottom-6"
    >
      <div class="pointer-events-auto w-full max-w-sm sm:w-[380px]">
        <slot />
      </div>
    </div>
  </teleport>
</template>