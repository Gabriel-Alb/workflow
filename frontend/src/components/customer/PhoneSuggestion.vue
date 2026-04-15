<template>
  <transition name="slide-down">
    <div
      v-if="customer"
      class="absolute left-0 right-0 top-full z-20 mt-1 overflow-hidden rounded-xl border border-black/10 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.12)]"
    >
      <button
        type="button"
        class="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-slate-50"
        @mousedown.prevent="$emit('select', customer)"
      >
        <div
          class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-black text-[11px] font-bold text-white"
        >
          {{ initials }}
        </div>

        <div class="min-w-0">
          <p class="truncate text-sm font-medium text-slate-900">
            {{ customer.nome }}
          </p>
          <p class="text-xs text-slate-400">
            {{ customer.telefone }}
          </p>
        </div>

        <span class="ml-auto shrink-0 text-xs text-slate-400">
          selecionar
        </span>
      </button>
    </div>
  </transition>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  customer: {
    type: Object,
    default: null,
  },
});

defineEmits(["select"]);

const initials = computed(() => {
  return (
    String(props.customer?.nome || "")
      .split(" ")
      .slice(0, 2)
      .map((part) => part[0] || "")
      .join("")
      .toUpperCase() || "?"
  );
});
</script>