<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @click.self="close"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-background/70 backdrop-blur-sm" @click="close" />

        <!-- Dialog -->
        <div
          role="dialog"
          aria-modal="true"
          class="modal-panel relative z-10 flex max-h-[85vh] w-full flex-col overflow-hidden rounded-2xl border border-border/50 bg-card text-card-foreground shadow-2xl"
          :class="sizeClass"
        >
          <div
            v-if="title || $slots.header"
            class="flex items-center justify-between gap-4 border-b border-border/40 px-5 py-4"
          >
            <slot name="header">
              <h2 class="text-lg font-bold">{{ title }}</h2>
            </slot>
            <button
              class="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Close"
              @click="close"
            >
              ✕
            </button>
          </div>

          <div class="overflow-y-auto px-5 py-4">
            <slot />
          </div>

          <div v-if="$slots.footer" class="border-t border-border/40 px-5 py-4">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, watch } from 'vue'

interface Props {
  modelValue: boolean
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  size: 'md',
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const sizeClass = computed(
  () =>
    ({
      sm: 'max-w-sm',
      md: 'max-w-md',
      lg: 'max-w-2xl',
      xl: 'max-w-4xl',
    })[props.size]
)

function close() {
  emit('update:modelValue', false)
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.modelValue) close()
}

watch(
  () => props.modelValue,
  open => {
    document.body.style.overflow = open ? 'hidden' : ''
  }
)

onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
})
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.25s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-panel,
.modal-leave-active .modal-panel {
  transition:
    transform 0.25s ease,
    opacity 0.25s ease;
}

.modal-enter-from .modal-panel,
.modal-leave-to .modal-panel {
  transform: scale(0.96) translateY(8px);
  opacity: 0;
}
</style>
