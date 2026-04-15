<template>
  <transition name="slide-down">
    <div
      v-if="customer && originalPhone"
      class="absolute left-0 right-0 top-full z-20 mt-1 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.12)]"
    >
      <div class="px-4 py-3">
        <p class="mb-3 text-sm text-slate-700">
          <span
            class="mdi mdi-information-outline mr-1 text-[14px] text-slate-400"
          ></span>
          <strong>{{ customer.nome }}</strong> tem
          <strong>{{ originalPhone }}</strong> cadastrado. O que deseja fazer?
        </p>

        <div class="flex gap-2">
          <button
            type="button"
            :disabled="loading"
            class="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-black px-3 py-2 text-xs font-semibold text-white transition hover:bg-black/85 disabled:opacity-60"
            @mousedown.prevent="$emit('replace')"
          >
            <span
              v-if="loading"
              class="mdi mdi-loading animate-spin text-[13px]"
            ></span>
            <span
              v-else
              class="mdi mdi-phone-sync-outline text-[13px]"
            ></span>
            {{ loading ? "Atualizando..." : "Substituir número" }}
          </button>

          <button
            type="button"
            class="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
            @mousedown.prevent="$emit('restore')"
          >
            <span class="mdi mdi-undo text-[13px]"></span>
            Manter original
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
defineProps({
  customer: {
    type: Object,
    default: null,
  },
  originalPhone: {
    type: String,
    default: "",
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

defineEmits(["replace", "restore"]);
</script>