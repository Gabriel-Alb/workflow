<template>
  <div class="mb-5">
    <label for="nome" class="mb-1.5 block text-sm font-medium text-slate-700">
      Nome completo <span class="text-red-500">*</span>
    </label>

    <div class="relative">
      <input
        id="nome"
        :value="modelValue"
        type="text"
        :placeholder="linkedCustomer ? '' : 'Ex: José da Silva'"
        autocomplete="off"
        :disabled="!!linkedCustomer"
        :class="resolvedInputClass"
        @input="onInput"
        @blur="$emit('blur')"
      />

      <span
        v-if="searching"
        class="mdi mdi-loading animate-spin absolute right-3 top-1/2 -translate-y-1/2 text-[15px] text-slate-400"
      ></span>

      <NameSuggestions
        v-if="customers.length && !linkedCustomer"
        :customers="customers"
        @select="$emit('select-customer', $event)"
      />
    </div>

    <p v-if="!linkedCustomer && error" class="mt-1.5 text-xs text-red-600">
      <span class="mdi mdi-alert-circle-outline"></span>
      {{ error }}
    </p>
  </div>
</template>

<script setup>
import { computed } from "vue";
import NameSuggestions from "../customer/NameSuggestions.vue";

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  inputClass: {
    type: String,
    required: true,
  },
  error: {
    type: String,
    default: "",
  },
  searching: {
    type: Boolean,
    default: false,
  },
  linkedCustomer: {
    type: Object,
    default: null,
  },
  customers: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["update:modelValue", "blur", "select-customer"]);

const resolvedInputClass = computed(() => {
  if (props.linkedCustomer) {
    return "w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none";
  }

  return props.inputClass;
});

function onInput(event) {
  emit("update:modelValue", event.target.value);
}
</script>