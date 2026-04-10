<template>
  <teleport to="body">
    <transition name="modal-fade">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-[9999] flex items-center justify-center px-4 py-6"
      >
        <div
          class="absolute inset-0 bg-black/45 backdrop-blur-[3px]"
          @click="handleClose"
        ></div>

        <transition name="modal-scale">
          <div
            v-if="modelValue"
            class="relative z-10 w-full max-w-md overflow-hidden rounded-[28px] border border-white/10 bg-white p-6 shadow-[0_30px_80px_rgba(0,0,0,0.22)] sm:p-7"
            role="dialog"
            aria-modal="true"
            :aria-labelledby="title ? 'base-modal-title' : undefined"
            :aria-describedby="
              description ? 'base-modal-description' : undefined
            "
          >
            <button
              v-if="showCloseButton"
              type="button"
              class="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-2xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              aria-label="Fechar modal"
              @click="handleClose"
            >
              <span class="mdi mdi-close text-[18px]"></span>
            </button>

            <div class="text-center">
              <div v-if="$slots.icon" class="mb-4 flex justify-center">
                <slot name="icon" />
              </div>

              <h3
                v-if="title"
                id="base-modal-title"
                class="text-xl font-semibold tracking-tight text-slate-900"
              >
                {{ title }}
              </h3>

              <p
                v-if="description"
                id="base-modal-description"
                class="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500"
              >
                {{ description }}
              </p>

              <div v-if="$slots.default" class="mt-4">
                <slot />
              </div>
            </div>

            <div
              class="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-center"
            >
              <button
                type="button"
                class="inline-flex h-12 items-center justify-center rounded-2xl border border-black/10 bg-white px-6 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                @click="handleCancel"
              >
                {{ cancelText }}
              </button>

              <button
                type="button"
                class="inline-flex h-12 items-center justify-center rounded-2xl bg-black px-6 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(0,0,0,0.12)] transition hover:bg-[#111111]"
                @click="handleConfirm"
              >
                {{ confirmText }}
              </button>
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: "",
  },
  description: {
    type: String,
    default: "",
  },
  confirmText: {
    type: String,
    default: "Confirmar",
  },
  cancelText: {
    type: String,
    default: "Cancelar",
  },
  showCloseButton: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(["update:modelValue", "confirm", "cancel", "close"]);

function handleClose() {
  emit("update:modelValue", false);
  emit("close");
}

function handleCancel() {
  emit("update:modelValue", false);
  emit("cancel");
}

function handleConfirm() {
  emit("confirm");
}
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.22s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-scale-enter-active,
.modal-scale-leave-active {
  transition: all 0.22s ease;
}

.modal-scale-enter-from,
.modal-scale-leave-to {
  opacity: 0;
  transform: scale(0.96) translateY(8px);
}
</style>
