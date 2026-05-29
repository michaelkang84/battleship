<template>
  <div
    class="flex flex-wrap items-center gap-2 rounded-xl border border-border/40 bg-card/50 px-3 py-2"
  >
    <span class="text-xs font-bold uppercase tracking-wider text-muted-foreground">
      🛠️ Ordnance
    </span>

    <button
      v-for="power in powers"
      :key="power.id"
      type="button"
      :disabled="isDisabled(power.id)"
      :title="power.description"
      class="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all"
      :class="buttonClass(power.id)"
      @click="store.selectPower(power.id)"
    >
      <span>{{ power.icon }}</span>
      <span>{{ power.name }}</span>
      <span v-if="store.powerUsed[power.id]" class="text-muted-foreground">✓</span>
    </button>

    <span v-if="hint" class="ml-1 text-xs font-medium text-primary">{{ hint }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { PowerType } from '@/game/types'
import { SPECIAL_POWERS } from '@/constants/game'
import { useGameStore } from '@/stores/gameStore'

const store = useGameStore()

const powers = Object.values(SPECIAL_POWERS)

function isDisabled(id: PowerType): boolean {
  if (store.powerUsed[id]) return true
  if (store.isProcessing) return true
  if (store.currentTurn !== 'player') return true
  // While a Salvo is mid-fire, lock the other powers until it's spent.
  if (store.salvoShotsRemaining > 0) return true
  return false
}

function buttonClass(id: PowerType): string {
  if (store.powerUsed[id]) {
    return 'cursor-not-allowed border-border/30 bg-muted/20 text-muted-foreground/50 line-through'
  }
  if (store.activePower === id) {
    return 'border-primary bg-primary/20 text-foreground shadow-glow'
  }
  if (isDisabled(id)) {
    return 'cursor-not-allowed border-border/30 bg-muted/20 text-muted-foreground/50'
  }
  return 'border-border/40 bg-card/60 text-foreground hover:border-primary/40 hover:bg-card'
}

const hint = computed(() => {
  if (store.salvoShotsRemaining > 0) return 'Salvo armed — fire on the enemy grid 🎯'
  if (store.activePower === 'sonar') return 'Select a 3×3 sector on the enemy grid'
  if (store.activePower === 'airstrike') return 'Select a 1×3 line on the enemy grid'
  return ''
})
</script>
