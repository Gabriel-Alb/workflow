<template>
  <div
    class="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end"
  >
    <RouterLink
      to="/"
      class="flex items-center justify-center gap-2 rounded-xl border border-black/10 px-6 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
    >
      Cancelar
    </RouterLink>

    <RouterLink
      v-if="linkedCustomer && !showReplaceWarning"
      :to="newServiceOrderRoute"
      class="flex items-center justify-center gap-2 rounded-xl bg-black px-8 py-3 text-sm font-semibold text-white transition hover:-translate-y-px hover:bg-black/85"
    >
      <span class="mdi mdi-file-document-plus-outline text-[18px]"></span>
      Nova O.S. para este cliente
    </RouterLink>

    <button
      v-if="linkedCustomer && showReplaceWarning"
      type="button"
      disabled
      class="flex cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-black/40 px-8 py-3 text-sm font-semibold text-white"
    >
      <span class="mdi mdi-alert-outline text-[18px]"></span>
      Resolva o número acima
    </button>

    <button
      v-if="!linkedCustomer"
      type="submit"
      :disabled="loading"
      class="flex items-center justify-center gap-2 rounded-xl bg-black px-8 py-3 text-sm font-semibold text-white transition hover:-translate-y-px hover:bg-black/85 disabled:cursor-not-allowed disabled:opacity-60"
    >
      <span
        v-if="loading"
        class="mdi mdi-loading animate-spin text-[18px]"
      ></span>
      <span
        v-else
        class="mdi mdi-account-plus-outline text-[18px]"
      ></span>
      {{ loading ? "Cadastrando..." : "Cadastrar cliente" }}
    </button>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  linkedCustomer: {
    type: Object,
    default: null,
  },
  showReplaceWarning: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const newServiceOrderRoute = computed(() => ({
  path: "/nova-os",
  query: {
    cliente_id: props.linkedCustomer?.id,
    nome: props.linkedCustomer?.nome,
  },
}));
</script>