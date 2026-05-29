<template>
  <div class="space-y-1.5">
    <div
      v-for="ship in ships"
      :key="ship.type"
      class="flex items-center gap-2 rounded-md px-2 py-1 transition-all duration-200"
      :class="ship.isSunk ? 'opacity-40' : ''"
    >
      <div class="flex gap-0.5">
        <div
          v-for="i in ship.length"
          :key="i"
          class="h-3 w-3 rounded-[2px] transition-colors duration-200"
          :class="getCellClass(ship, i)"
        />
      </div>
      <span
        class="text-xs font-medium transition-all"
        :class="ship.isSunk ? 'text-muted-foreground line-through' : 'text-foreground'"
      >
        {{ getShipName(ship.type) }}
      </span>
      <span v-if="ship.isSunk" class="ml-auto text-xs text-destructive">SUNK</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Ship } from '@/game/types'
import { SHIP_TYPES } from '@/constants/game'

interface Props {
  ships: Ship[]
  variant?: 'player' | 'opponent'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'player',
})

function getShipName(type: string): string {
  const config = SHIP_TYPES[type as keyof typeof SHIP_TYPES]
  return config?.name ?? type
}

function getCellClass(ship: Ship, cellIndex: number): string {
  if (ship.isSunk) {
    return 'bg-destructive/50'
  }

  if (props.variant === 'opponent') {
    return 'bg-muted-foreground/30'
  }

  if (cellIndex <= ship.hits) {
    return 'bg-destructive'
  }

  return props.variant === 'player' ? 'bg-primary/60' : 'bg-muted-foreground/30'
}
</script>
