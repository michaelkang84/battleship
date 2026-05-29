<template>
  <div class="pointer-events-none fixed inset-x-0 top-4 z-50 flex flex-col items-center gap-2 px-4">
    <TransitionGroup name="toast">
      <div
        v-for="toast in store.shipSunkNotifications"
        :key="toast.id"
        class="pointer-events-auto flex w-full max-w-md items-center gap-3 rounded-xl border px-4 py-3 shadow-glow backdrop-blur-md"
        :class="
          toast.by === 'player'
            ? 'border-primary/30 bg-primary/15 text-foreground'
            : 'border-destructive/30 bg-destructive/15 text-foreground'
        "
        role="status"
        aria-live="polite"
      >
        <span class="text-2xl">{{ toast.by === 'player' ? '🔥' : '💥' }}</span>
        <div class="flex-1">
          <p class="text-sm font-bold">
            {{ toast.by === 'player' ? 'Enemy ship sunk!' : 'Ship lost!' }}
          </p>
          <p class="text-xs text-muted-foreground">
            <template v-if="toast.by === 'player'">
              You sunk the enemy's
              <span class="font-semibold text-foreground">{{ toast.shipType }}</span
              >.
            </template>
            <template v-else>
              The enemy sunk your
              <span class="font-semibold text-foreground">{{ toast.shipType }}</span
              >.
            </template>
          </p>
        </div>
        <button
          class="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-foreground/10 hover:text-foreground"
          aria-label="Dismiss notification"
          @click="store.dismissShipSunkNotification(toast.id)"
        >
          ✕
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { watch } from 'vue'
import { useGameStore } from '@/stores/gameStore'

const AUTO_DISMISS_MS = 4500

const store = useGameStore()
const timers = new Map<number, ReturnType<typeof setTimeout>>()

watch(
  () => store.shipSunkNotifications,
  notifications => {
    for (const toast of notifications) {
      if (!timers.has(toast.id)) {
        const timer = setTimeout(() => {
          store.dismissShipSunkNotification(toast.id)
          timers.delete(toast.id)
        }, AUTO_DISMISS_MS)
        timers.set(toast.id, timer)
      }
    }
  },
  { deep: true, immediate: true }
)
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateY(-16px) scale(0.95);
}

.toast-leave-to {
  opacity: 0;
  transform: translateY(-16px) scale(0.95);
}

.toast-leave-active {
  position: absolute;
}
</style>
