<template>
  <div class="mb-5">
    <label
      for="telefone"
      class="mb-1.5 block text-sm font-medium text-slate-700"
    >
      Telefone
      <span class="ml-1 text-xs font-normal text-slate-400">(opcional)</span>
    </label>

    <div class="relative">
      <input
        id="telefone"
        :value="modelValue"
        type="tel"
        maxlength="15"
        placeholder="(00) 00000-0000"
        autocomplete="off"
        :class="[inputClass, linkedCustomer ? 'pr-20' : 'pr-10']"
        @input="onInput"
        @blur="$emit('blur')"
      />

      <div
        class="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-1.5"
      >
        <span
          v-if="searching"
          class="mdi mdi-loading animate-spin text-[15px] text-slate-400"
        ></span>

        <button
          v-if="linkedCustomer"
          type="button"
          class="flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-500 transition hover:bg-slate-200"
          @click="$emit('clear-link')"
        >
          <span class="mdi mdi-close text-[11px]"></span>
          limpar
        </button>
      </div>

      <PhoneSuggestion
        v-if="phoneSuggestion && !linkedCustomer && !showReplaceWarning"
        :customer="phoneSuggestion"
        @select="$emit('select-suggestion', $event)"
      />

      <PhoneReplaceWarning
        v-if="showReplaceWarning && linkedCustomer"
        :customer="linkedCustomer"
        :original-phone="originalPhone"
        :loading="replacingPhone"
        @replace="$emit('replace-phone')"
        @restore="$emit('restore-phone')"
      />
    </div>

    <p v-if="error" class="mt-1.5 text-xs text-red-600">
      <span class="mdi mdi-alert-circle-outline"></span>
      {{ error }}
    </p>
  </div>
</template>

<script setup>
import PhoneReplaceWarning from "@/components/customer/PhoneReplaceWarning.vue";
import PhoneSuggestion from "@/components/customer/PhoneSuggestion.vue";

defineProps({
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
  replacingPhone: {
    type: Boolean,
    default: false,
  },
  phoneSuggestion: {
    type: Object,
    default: null,
  },
  linkedCustomer: {
    type: Object,
    default: null,
  },
  originalPhone: {
    type: String,
    default: "",
  },
  showReplaceWarning: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits([
  "update:modelValue",
  "input",
  "blur",
  "clear-link",
  "select-suggestion",
  "replace-phone",
  "restore-phone",
]);

function onInput(event) {
  emit("update:modelValue", event.target.value);
  emit("input", event);
}
</script>