<template>
  <transition name="toast-slide">
    <div
      v-if="visible"
      :class="wrapperClass"
      role="status"
      aria-live="polite"
    >
      <div class="flex items-start gap-3">
        <div
          :class="iconWrapperClass"
          class="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl"
        >
          <span :class="iconClass"></span>
        </div>

        <div class="min-w-0 flex-1">
          <p
            v-if="title"
            class="text-sm font-semibold leading-5 text-white"
          >
            {{ title }}
          </p>

          <p class="mt-0.5 text-sm leading-6 text-white/90">
            {{ message }}
          </p>
        </div>

      </div>

      <div class="mt-4 h-1.5 overflow-hidden rounded-full bg-white/20">
        <div
          :class="progressClass"
          :style="{ width: `${progress}%`, transitionDuration: `${tickMs}ms` }"
        ></div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  variant: {
    type: String,
    default: 'success',
    validator: (value) => ['success', 'warning', 'error'].includes(value),
  },
  title: {
    type: String,
    default: '',
  },
  message: {
    type: String,
    default: '',
  },
  duration: {
    type: Number,
    default: 4000,
  },
})

const emit = defineEmits(['update:modelValue', 'close'])

const visible = ref(props.modelValue)
const progress = ref(0)

let intervalId = null
const tickMs = 100
const totalTicks = computed(() => Math.max(1, Math.floor(props.duration / tickMs)))
const step = computed(() => 100 / totalTicks.value)

const styles = {
  success: {
    wrapper:
      'w-full rounded-[24px] border border-emerald-300/35 bg-emerald-500/70 p-4 shadow-[0_20px_50px_rgba(16,185,129,0.28)] backdrop-blur-xl',
    iconWrapper: 'bg-white/14 ring-1 ring-white/10',
    icon: 'mdi mdi-check-circle text-[20px] text-white',
    progress: 'h-full rounded-full bg-white/90',
  },
  warning: {
    wrapper:
      'w-full rounded-[24px] border border-amber-300/35 bg-amber-500/70 p-4 shadow-[0_20px_50px_rgba(245,158,11,0.28)] backdrop-blur-xl',
    iconWrapper: 'bg-white/14 ring-1 ring-white/10',
    icon: 'mdi mdi-alert-outline text-[20px] text-white',
    progress: 'h-full rounded-full bg-white/90',
  },
  error: {
    wrapper:
      'w-full rounded-[24px] border border-red-300/35 bg-red-500/70 p-4 shadow-[0_20px_50px_rgba(239,68,68,0.28)] backdrop-blur-xl',
    iconWrapper: 'bg-white/14 ring-1 ring-white/10',
    icon: 'mdi mdi-alert-circle-outline text-[20px] text-white',
    progress: 'h-full rounded-full bg-white/90',
  },
}

const wrapperClass = computed(() => styles[props.variant].wrapper)
const iconWrapperClass = computed(() => styles[props.variant].iconWrapper)
const iconClass = computed(() => styles[props.variant].icon)
const progressClass = computed(() => styles[props.variant].progress)

function clearTimer() {
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
  }
}

function startTimer() {
  clearTimer()
  progress.value = 0

  intervalId = setInterval(() => {
    progress.value = Math.min(100, progress.value + step.value)

    if (progress.value >= 100) {
      closeToast()
    }
  }, tickMs)
}

function closeToast() {
  clearTimer()
  visible.value = false
  emit('update:modelValue', false)
  emit('close')
}

watch(
  () => props.modelValue,
  (value) => {
    visible.value = value

    if (value) {
      startTimer()
    } else {
      clearTimer()
    }
  },
  { immediate: true }
)

onMounted(() => {
  if (props.modelValue) startTimer()
})

onBeforeUnmount(() => {
  clearTimer()
})
</script>

<style scoped>
.toast-slide-enter-active,
.toast-slide-leave-active {
  transition: all 0.28s ease;
}

.toast-slide-enter-from,
.toast-slide-leave-to {
  opacity: 0;
  transform: translateY(12px) translateX(8px);
}
</style>