<template>
  <teleport to="body">
    <transition name="modal">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-end justify-center px-4 pb-4 sm:items-center sm:pb-0"
        @keydown.esc="$emit('close')"
      >
        <div
          class="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
          @click="$emit('close')"
        ></div>

        <div
          class="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-[0_32px_80px_rgba(0,0,0,0.22)]"
        >
          <div
            class="flex items-center justify-between border-b border-black/8 px-6 py-4"
          >
            <div class="flex items-center gap-3">
              <div
                class="flex h-8 w-8 items-center justify-center rounded-xl bg-black text-white"
              >
                <span class="mdi mdi-pencil-outline text-[15px]"></span>
              </div>

              <div>
                <h3 class="text-sm font-semibold text-slate-900">
                  Editar cliente
                </h3>
                <p class="mt-0.5 text-xs text-slate-400">
                  Corrija os dados cadastrados
                </p>
              </div>
            </div>

            <button
              type="button"
              class="flex h-8 w-8 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              @click="$emit('close')"
            >
              <span class="mdi mdi-close text-[18px]"></span>
            </button>
          </div>

          <transition name="fade">
            <div
              v-if="errorMessage"
              class="mx-6 mt-4 flex items-start gap-2 rounded-xl bg-red-50 px-4 py-3 text-xs text-red-700 ring-1 ring-red-200"
            >
              <span
                class="mdi mdi-alert-circle-outline mt-0.5 shrink-0 text-[15px]"
              ></span>
              {{ errorMessage }}
            </div>
          </transition>

          <transition name="fade">
            <div
              v-if="successMessage"
              class="mx-6 mt-4 flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-xs text-emerald-700 ring-1 ring-emerald-200"
            >
              <span class="mdi mdi-check-circle-outline text-[15px]"></span>
              Dados atualizados com sucesso!
            </div>
          </transition>

          <div class="space-y-4 px-6 py-5">
            <div>
              <label class="mb-1.5 block text-xs font-medium text-slate-600">
                Nome completo <span class="text-red-500">*</span>
              </label>
              <input
                :value="form.nome"
                type="text"
                placeholder="Nome do cliente"
                :class="getInputClass('nome')"
                @input="updateField('nome', $event.target.value)"
                @blur="$emit('touch-field', 'nome')"
              />
              <p
                v-if="touchedFields.nome && errors.nome"
                class="mt-1 text-xs text-red-600"
              >
                {{ errors.nome }}
              </p>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="mb-1.5 block text-xs font-medium text-slate-600">
                  Telefone
                </label>
                <input
                  :value="form.telefone"
                  type="tel"
                  maxlength="15"
                  placeholder="(00) 00000-0000"
                  :class="getInputClass('telefone')"
                  @input="$emit('phone-input', $event)"
                />
              </div>

              <div>
                <label class="mb-1.5 block text-xs font-medium text-slate-600">
                  CPF
                </label>
                <input
                  :value="form.cpf"
                  type="text"
                  maxlength="14"
                  inputmode="numeric"
                  placeholder="000.000.000-00"
                  :class="getInputClass('cpf')"
                  @input="$emit('cpf-input', $event)"
                  @blur="$emit('touch-field', 'cpf')"
                />
                <p
                  v-if="touchedFields.cpf && errors.cpf"
                  class="mt-1 text-xs text-red-600"
                >
                  {{ errors.cpf }}
                </p>
              </div>
            </div>

            <div>
              <label class="mb-1.5 block text-xs font-medium text-slate-600">
                E-mail
              </label>
              <input
                :value="form.email"
                type="email"
                placeholder="exemplo@email.com"
                :class="getInputClass('email')"
                @input="updateField('email', $event.target.value)"
                @blur="$emit('touch-field', 'email')"
              />
              <p
                v-if="touchedFields.email && errors.email"
                class="mt-1 text-xs text-red-600"
              >
                {{ errors.email }}
              </p>
            </div>

            <div>
              <label class="mb-1.5 block text-xs font-medium text-slate-600">
                Observações
              </label>
              <textarea
                :value="form.informacao_adicional"
                rows="2"
                placeholder="Endereço, referência, anotações..."
                class="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-black focus:bg-white focus:ring-2 focus:ring-black/10"
                @input="updateField('informacao_adicional', $event.target.value)"
              ></textarea>
            </div>
          </div>

          <div
            class="flex items-center justify-end gap-3 border-t border-black/8 px-6 py-4"
          >
            <button
              type="button"
              class="rounded-xl border border-black/10 px-5 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
              @click="$emit('close')"
            >
              Cancelar
            </button>

            <button
              type="button"
              :disabled="loading"
              class="flex items-center gap-2 rounded-xl bg-black px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-black/85 disabled:opacity-60"
              @click="$emit('save')"
            >
              <span
                v-if="loading"
                class="mdi mdi-loading animate-spin text-[16px]"
              ></span>
              <span
                v-else
                class="mdi mdi-content-save-outline text-[16px]"
              ></span>
              {{ loading ? "Salvando..." : "Salvar alterações" }}
            </button>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  errorMessage: {
    type: String,
    default: "",
  },
  successMessage: {
    type: Boolean,
    default: false,
  },
  form: {
    type: Object,
    required: true,
  },
  errors: {
    type: Object,
    required: true,
  },
  touchedFields: {
    type: Object,
    required: true,
  },
});

defineEmits([
  "close",
  "save",
  "touch-field",
  "update-field",
  "phone-input",
  "cpf-input",
]);

function updateField(field, value) {
  const eventName = "update-field";
  return defineEmits ? null : [field, value];
}

function getInputClass(field) {
  const base =
    "w-full rounded-xl border bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-2";

  return props.touchedFields[field] && props.errors[field]
    ? `${base} border-red-300 focus:border-red-400 focus:ring-red-100`
    : `${base} border-slate-200 focus:border-black focus:ring-black/10`;
}
</script>