<template>
  <div
    class="overflow-hidden rounded-[28px] border border-black/10 bg-white shadow-[0_10px_30px_rgba(0,0,0,0.05)]"
  >
    <form class="p-6 sm:p-8" @submit.prevent="handleSubmit">
      <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
        <!-- NOME -->
        <div class="space-y-2">
          <label
            for="nome"
            class="block text-sm font-semibold tracking-wide text-black/80"
          >
            Nome completo <span class="text-red-500">*</span>
          </label>

          <input
            id="nome"
            v-model="form.nome"
            type="text"
            placeholder="Ex: José da Silva"
            :class="[
              baseInputClass,
              errors.nome
                ? 'border border-red-400 focus:border-red-500 focus:ring-red-100'
                : 'border border-black/10 focus:border-black focus:ring-black/5',
            ]"
          />

          <p v-if="errors.nome" class="text-sm text-red-500">
            {{ errors.nome }}
          </p>
        </div>

        <!-- CPF -->
        <div class="space-y-2">
          <label
            for="cpf"
            class="block text-sm font-semibold tracking-wide text-black/80"
          >
            CPF <span class="text-red-500">*</span>
          </label>

          <input
            id="cpf"
            v-model="form.cpf"
            type="text"
            maxlength="14"
            placeholder="000.000.000-00"
            :class="[
              baseInputClass,
              errors.cpf
                ? 'border border-red-400 focus:border-red-500 focus:ring-red-100'
                : 'border border-black/10 focus:border-black focus:ring-black/5',
            ]"
            @input="form.cpf = formatCpf(form.cpf)"
          />

          <p v-if="errors.cpf" class="text-sm text-red-500">
            {{ errors.cpf }}
          </p>
        </div>

        <!-- TELEFONE -->
        <div class="space-y-2">
          <label
            for="telefone"
            class="block text-sm font-semibold tracking-wide text-black/80"
          >
            Telefone <span class="text-red-500">*</span>
          </label>

          <input
            id="telefone"
            v-model="form.telefone"
            type="tel"
            maxlength="15"
            placeholder="(00) 00000-0000"
            :class="[
              baseInputClass,
              errors.telefone
                ? 'border border-red-400 focus:border-red-500 focus:ring-red-100'
                : 'border border-black/10 focus:border-black focus:ring-black/5',
            ]"
            @input="form.telefone = formatPhone(form.telefone)"
          />

          <p v-if="errors.telefone" class="text-sm text-red-500">
            {{ errors.telefone }}
          </p>
        </div>

        <!-- EMAIL -->
        <div class="space-y-2">
          <label
            for="email"
            class="block text-sm font-semibold tracking-wide text-black/80"
          >
            E-mail
            <span class="ml-1 text-xs font-normal text-black/40">
              (opcional)
            </span>
          </label>

          <input
            id="email"
            v-model="form.email"
            type="email"
            placeholder="exemplo@email.com"
            :class="[
              baseInputClass,
              errors.email
                ? 'border border-red-400 focus:border-red-500 focus:ring-red-100'
                : 'border border-black/10 focus:border-black focus:ring-black/5',
            ]"
          />

          <p v-if="errors.email" class="text-sm text-red-500">
            {{ errors.email }}
          </p>
        </div>
      </div>

      <!-- OBSERVAÇÕES -->
      <div class="mt-5 space-y-2">
        <label
          for="observacoes"
          class="block text-sm font-semibold tracking-wide text-black/80"
        >
          Observações
          <span class="ml-1 text-xs font-normal text-black/40">
            (opcional)
          </span>
        </label>

        <textarea
          id="observacoes"
          v-model="form.informacao_adicional"
          rows="5"
          placeholder="Endereço, referência, anotações..."
          class="w-full rounded-2xl border border-black/10 bg-[#fafafa] px-4 py-4 text-sm text-black placeholder:text-black/35 shadow-[0_4px_14px_rgba(0,0,0,0.04)] outline-none transition duration-200 focus:border-black focus:bg-white focus:ring-4 focus:ring-black/5"
        ></textarea>
      </div>

      <!-- ACTIONS -->
      <div
        class="mt-8 flex flex-col-reverse gap-3 border-t border-black/10 pt-6 sm:flex-row sm:items-center sm:justify-end"
      >
        <button
          type="submit"
          :disabled="loading"
          class="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-black px-6 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(0,0,0,0.12)] transition hover:-translate-y-[1px] hover:bg-[#111111] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span
            v-if="loading"
            class="mdi mdi-loading animate-spin text-[18px]"
          ></span>
          <span
            v-else
            class="mdi mdi-account-plus-outline text-[18px]"
          ></span>
          {{ loading ? 'Cadastrando...' : 'Cadastrar cliente' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive } from 'vue'

defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['submit'])

const baseInputClass =
  'h-14 w-full rounded-2xl bg-[#fafafa] px-4 text-sm text-black placeholder:text-black/35 shadow-[0_4px_14px_rgba(0,0,0,0.04)] outline-none transition duration-200 focus:bg-white focus:ring-4'

const form = reactive({
  nome: '',
  cpf: '',
  telefone: '',
  email: '',
  informacao_adicional: '',
})

const errors = reactive({
  nome: '',
  cpf: '',
  telefone: '',
  email: '',
})

function formatCpf(value) {
  const digits = value.replace(/\D/g, '').slice(0, 11)

  return digits
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
}

function formatPhone(value) {
  const digits = value.replace(/\D/g, '').slice(0, 11)

  if (digits.length <= 10) {
    return digits
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d)/, '$1-$2')
  }

  return digits
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2')
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function validateForm() {
  errors.nome = ''
  errors.cpf = ''
  errors.telefone = ''
  errors.email = ''

  let isValid = true

  if (!form.nome.trim()) {
    errors.nome = 'O nome completo é obrigatório.'
    isValid = false
  }

  const cpfDigits = form.cpf.replace(/\D/g, '')
  if (!cpfDigits) {
    errors.cpf = 'O CPF é obrigatório.'
    isValid = false
  } else if (cpfDigits.length !== 11) {
    errors.cpf = 'Informe um CPF válido.'
    isValid = false
  }

  const phoneDigits = form.telefone.replace(/\D/g, '')
  if (!phoneDigits) {
    errors.telefone = 'O telefone é obrigatório.'
    isValid = false
  } else if (phoneDigits.length < 10 || phoneDigits.length > 11) {
    errors.telefone = 'Informe um telefone válido.'
    isValid = false
  }

  if (form.email.trim() && !isValidEmail(form.email.trim())) {
    errors.email = 'Informe um e-mail válido.'
    isValid = false
  }

  return isValid
}

function handleSubmit() {
  const isFormValid = validateForm()

  if (!isFormValid) return

  emit('submit', { ...form })
}
</script>