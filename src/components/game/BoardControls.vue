<template>
  <div class="flex flex-wrap items-center gap-2">
    <!-- View mode toggle -->
    <div class="flex rounded-lg border border-border/30 bg-card/50 p-0.5">
      <button
        v-for="view in viewModes"
        :key="view.value"
        :class="[
          'rounded-md px-3 py-1.5 text-xs font-semibold transition-all duration-200',
          currentView === view.value
            ? 'bg-primary text-primary-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground',
        ]"
        @click="$emit('viewChange', view.value)"
      >
        {{ view.label }}
      </button>
    </div>

    <div class="h-5 w-px bg-border/30" />

    <!-- Rotate board -->
    <button
      class="flex items-center gap-1.5 rounded-lg border border-border/30 bg-card/50 px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-all duration-200 hover:bg-card hover:text-foreground"
      @click="$emit('rotate')"
    >
      <span
        class="inline-block transition-transform duration-300"
        :style="{ transform: `rotate(${rotation}deg)` }"
        >↻</span
      >
      Rotate
    </button>

    <!-- Focus mode -->
    <button
      :class="[
        'flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all duration-200',
        isFocused
          ? 'border-accent/50 bg-accent/15 text-accent'
          : 'border-border/30 bg-card/50 text-muted-foreground hover:bg-card hover:text-foreground',
      ]"
      @click="$emit('toggleFocus')"
    >
      🎯 {{ isFocused ? 'Exit Focus' : 'Focus' }}
    </button>
  </div>
</template>

<script setup lang="ts">
import type { ViewMode } from '@/game/types'

interface Props {
  currentView: ViewMode
  rotation: number
  isFocused: boolean
}

defineProps<Props>()

defineEmits<{
  viewChange: [mode: ViewMode]
  rotate: []
  toggleFocus: []
}>()

const viewModes = [
  { value: 'player' as ViewMode, label: 'My Board' },
  { value: 'split' as ViewMode, label: 'Split View' },
  { value: 'opponent' as ViewMode, label: 'Enemy Board' },
]
</script>
