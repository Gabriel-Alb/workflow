<template>
  <transition name="fade">
    <div
      v-if="message"
      class="mb-6 flex items-start gap-3 rounded-xl bg-red-50 px-4 py-3.5 text-sm text-red-700 ring-1 ring-red-200"
    >
      <span
        class="mdi mdi-alert-circle-outline mt-0.5 shrink-0 text-[18px]"
      ></span>
      {{ message }}
    </div>
  </transition>
</template>

<script setup>
defineProps({
  message: {
    type: String,
    default: "",
  },
});
</script>