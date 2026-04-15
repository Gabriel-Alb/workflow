<template>
  <div class="flex flex-col items-center justify-center py-16 text-center">
    <div class="relative mb-6">
      <div
        class="flex h-24 w-24 items-center justify-center rounded-full bg-emerald-50 ring-8 ring-emerald-50/50"
      >
        <span class="mdi mdi-check-circle text-[52px] text-emerald-500"></span>
      </div>

      <div
        class="absolute inset-0 animate-ping rounded-full bg-emerald-100 opacity-40"
        style="animation-duration: 1.4s; animation-iteration-count: 2"
      ></div>
    </div>

    <h2 class="text-2xl font-semibold text-slate-900 sm:text-3xl">
      Cliente cadastrado!
    </h2>

    <p class="mt-2 max-w-xs text-sm leading-6 text-slate-500">
      <strong class="text-slate-700">{{ customer?.nome }}</strong>
      foi adicionado com sucesso.
    </p>

    <div class="mt-8 flex flex-col gap-3 sm:flex-row">
      <RouterLink
        :to="newServiceOrderRoute"
        class="flex items-center gap-2 rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-px hover:bg-black/85"
      >
        <span class="mdi mdi-file-document-plus-outline text-[18px]"></span>
        Abrir O.S. agora
      </RouterLink>

      <button
        type="button"
        class="flex items-center gap-2 rounded-xl border border-black/10 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:-translate-y-px hover:bg-slate-50"
        @click="$emit('reset')"
      >
        <span class="mdi mdi-account-plus-outline text-[18px]"></span>
        Cadastrar outro
      </button>

      <button
        type="button"
        class="flex items-center gap-2 rounded-xl border border-black/10 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:-translate-y-px hover:bg-slate-50"
        @click="$emit('edit')"
      >
        <span class="mdi mdi-pencil-outline text-[18px]"></span>
        Corrigir dados
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  customer: {
    type: Object,
    default: null,
  },
});

defineEmits(["reset", "edit"]);

const newServiceOrderRoute = computed(() => ({
  path: "/nova-os",
  query: {
    cliente_id: props.customer?.id,
    nome: props.customer?.nome,
  },
}));
</script>