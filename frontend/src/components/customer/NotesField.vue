<template>
  <div class="mb-5">
    <label for="info" class="mb-1.5 block text-sm font-medium text-slate-700">
      Observações
      <span class="ml-1 text-xs font-normal text-slate-400">(opcional)</span>
    </label>

    <textarea
      id="info"
      :value="modelValue"
      rows="3"
      placeholder="Endereço, referência, anotações..."
      class="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-black focus:bg-white focus:ring-2 focus:ring-black/10"
      @input="onInput"
    ></textarea>
  </div>
</template>

<script setup>
defineProps({
  modelValue: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:modelValue"]);

function onInput(event) {
  emit("update:modelValue", event.target.value);
}
</script>