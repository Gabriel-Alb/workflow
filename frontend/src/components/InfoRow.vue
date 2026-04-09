<template>
  <div class="flex items-center gap-3 py-2.5">
    <span :class="`mdi ${icon} text-[17px] text-slate-400 shrink-0`"></span>
    <span class="text-sm text-slate-700 truncate">{{ value }}</span>
  </div>
</template>

<script setup>
defineProps({ icon: String, value: String })
</script>
