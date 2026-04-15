<template>
  <div>
    <label for="cpf" class="mb-1.5 block text-sm font-medium text-slate-700">
      CPF
      <span class="ml-1 text-xs font-normal text-slate-400">(opcional)</span>
    </label>

    <input
      id="cpf"
      :value="modelValue"
      type="text"
      maxlength="14"
      inputmode="numeric"
      placeholder="000.000.000-00"
      :class="inputClass"
      @input="onInput"
      @blur="$emit('blur')"
    />

    <p v-if="error" class="mt-1.5 text-xs text-red-600">
      <span class="mdi mdi-alert-circle-outline"></span>
      {{ error }}
    </p>
  </div>
</template>

<script setup>
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
});

const emit = defineEmits(["update:modelValue", "input", "blur"]);

function onInput(event) {
  emit("update:modelValue", event.target.value);
  emit("input", event);
}
</script>