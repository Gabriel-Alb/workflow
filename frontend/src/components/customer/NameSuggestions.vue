<template>
  <transition name="slide-down">
    <div
      v-if="customers.length"
      class="absolute left-0 right-0 top-full z-20 mt-1 overflow-hidden rounded-xl border border-black/10 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.12)]"
    >
      <button
        v-for="customer in customers"
        :key="customer.id"
        type="button"
        class="flex w-full items-center gap-3 border-t border-black/5 px-4 py-3 text-left transition first:border-0 hover:bg-slate-50"
        @mousedown.prevent="$emit('select', customer)"
      >
        <div
          class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-black text-[11px] font-bold text-white"
        >
          {{ getInitials(customer.nome) }}
        </div>

        <div class="min-w-0 flex-1">
          <p class="truncate text-sm font-medium text-slate-900">
            {{ customer.nome }}
          </p>
          <p class="text-xs text-slate-400">
            <span v-if="customer.telefone">{{ customer.telefone }}</span>
            <span v-else class="italic">Sem telefone</span>
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
defineProps({
  customers: {
    type: Array,
    default: () => [],
  },
});

defineEmits(["select"]);

function getInitials(name = "") {
  return (
    String(name)
      .split(" ")
      .slice(0, 2)
      .map((part) => part[0] || "")
      .join("")
      .toUpperCase() || "?"
  );
}
</script>