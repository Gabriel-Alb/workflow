<template>
  <div>
    <BasePageTitle
      class="mb-8"
      title="Novo cliente"
      description="Todos os campos são opcionais, exceto o nome."
    />

    <NewCustomerGlobalError :message="globalError" />

    <form
      class="rounded-2xl border border-black/8 bg-white p-6 shadow-[0_4px_24px_rgba(15,23,42,0.06)] sm:p-8"
      novalidate
      @submit.prevent="$emit('submit')"
    >
      <PhoneField
        :model-value="form.telefone"
        :input-class="getInputClass('telefone')"
        :error="errors.telefone"
        :searching="isSearchingByPhone"
        :replacing-phone="isReplacingPhone"
        :phone-suggestion="phoneSuggestion"
        :linked-customer="linkedCustomer"
        :original-phone="originalPhone"
        :show-replace-warning="showReplacePhoneWarning"
        @update:model-value="updateField('telefone', $event)"
        @input="$emit('phone-input', $event)"
        @blur="$emit('touch-field', 'telefone')"
        @clear-link="$emit('unlink-customer')"
        @select-suggestion="$emit('link-customer', $event)"
        @replace-phone="$emit('replace-phone')"
        @restore-phone="$emit('restore-phone')"
      />

      <NameField
        :model-value="form.nome"
        :input-class="getInputClass('nome')"
        :error="errors.nome"
        :searching="isSearchingByName"
        :linked-customer="linkedCustomer"
        :customers="nameSuggestions"
        @update:model-value="updateField('nome', $event)"
        @blur="$emit('touch-field', 'nome')"
        @select-customer="$emit('link-customer', $event)"
      />

      <div class="mb-5 grid gap-5 sm:grid-cols-2">
        <CpfField
          :model-value="form.cpf"
          :input-class="getInputClass('cpf')"
          :error="errors.cpf"
          @update:model-value="updateField('cpf', $event)"
          @input="$emit('cpf-input', $event)"
          @blur="$emit('touch-field', 'cpf')"
        />

        <EmailField
          :model-value="form.email"
          :input-class="getInputClass('email')"
          :error="errors.email"
          @update:model-value="updateField('email', $event)"
          @blur="$emit('touch-field', 'email')"
        />
      </div>

      <NotesField
        :model-value="form.informacao_adicional"
        @update:model-value="updateField('informacao_adicional', $event)"
      />

      <FormActions
        :linked-customer="linkedCustomer"
        :show-replace-warning="showReplacePhoneWarning"
        :loading="loading"
      />
    </form>
  </div>
</template>

<script setup>
import BasePageTitle from "@/components/base/BasePageTitle.vue";
import CpfField from "@/components/customer/CpfField.vue";
import EmailField from "@/components/customer/EmailField.vue";
import FormActions from "@/components/customer/FormActions.vue";
import NameField from "@/components/customer/NameField.vue";
import NewCustomerGlobalError from "@/components/customer/NewCustomerGlobalError.vue";
import NotesField from "@/components/customer/NotesField.vue";
import PhoneField from "@/components/customer/PhoneField.vue";

const props = defineProps({
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
  globalError: {
    type: String,
    default: "",
  },
  loading: {
    type: Boolean,
    default: false,
  },
  linkedCustomer: {
    type: Object,
    default: null,
  },
  phoneSuggestion: {
    type: Object,
    default: null,
  },
  originalPhone: {
    type: String,
    default: "",
  },
  showReplacePhoneWarning: {
    type: Boolean,
    default: false,
  },
  isSearchingByPhone: {
    type: Boolean,
    default: false,
  },
  isReplacingPhone: {
    type: Boolean,
    default: false,
  },
  isSearchingByName: {
    type: Boolean,
    default: false,
  },
  nameSuggestions: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits([
  "submit",
  "update-field",
  "touch-field",
  "phone-input",
  "cpf-input",
  "link-customer",
  "unlink-customer",
  "replace-phone",
  "restore-phone",
]);

function updateField(field, value) {
  emit("update-field", field, value);
}

function getInputClass(field) {
  const base =
    "w-full rounded-xl border bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-2";

  return props.touchedFields[field] && props.errors[field]
    ? `${base} border-red-300 focus:border-red-400 focus:ring-red-100`
    : `${base} border-slate-200 focus:border-black focus:ring-black/10`;
}
</script>