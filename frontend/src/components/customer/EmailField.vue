<template>
  <div>
    <label for="email" class="mb-1.5 block text-sm font-medium text-slate-700">
      E-mail
      <span class="ml-1 text-xs font-normal text-slate-400">(opcional)</span>
    </label>

    <input
      id="email"
      :value="modelValue"
      type="email"
      placeholder="exemplo@email.com"
      autocomplete="email"
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

const emit = defineEmits(["update:modelValue", "blur"]);

function onInput(event) {
  emit("update:modelValue", event.target.value);
}
</script>