<template>
  <div class="max-h-32 overflow-y-auto rounded-lg bg-muted/20 p-2">
    <div
      v-for="(move, index) in reversedMoves"
      :key="index"
      class="flex items-center gap-2 border-b border-border/20 px-2 py-1.5 text-xs last:border-0"
    >
      <span class="font-mono text-muted-foreground">{{ formatElapsed(move.timestamp) }}</span>
      <Badge :variant="move.player === 'player' ? 'default' : 'accent'" size="sm">
        {{ move.player === 'player' ? 'You' : 'AI' }}
      </Badge>
      <span class="text-muted-foreground">→</span>
      <span class="font-mono font-semibold">{{ formatCoord(move.coordinates) }}</span>
      <span :class="move.result === 'hit' ? 'text-red-400' : 'text-blue-400'">
        {{ move.result === 'hit' ? '💥 Hit' : '🌊 Miss' }}
      </span>
      <span v-if="move.sunk" class="font-bold text-destructive"> · Sunk! </span>
    </div>

    <div v-if="moves.length === 0" class="py-2 text-center text-xs italic text-muted-foreground">
      No moves yet
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { GameMove } from '@/game/types'
import { COL_LABELS, ROW_LABELS } from '@/constants/game'
import Badge from '@/components/ui/Badge.vue'

interface Props {
  moves: GameMove[]
}

const props = defineProps<Props>()

const reversedMoves = computed(() => [...props.moves].reverse())

function formatCoord(coord: { row: number; col: number }): string {
  return `${COL_LABELS[coord.col]}${ROW_LABELS[coord.row]}`
}

function formatElapsed(timestamp: number): string {
  const firstMove = props.moves[0]?.timestamp ?? timestamp
  const elapsed = Math.max(0, Math.floor((timestamp - firstMove) / 1000))
  const mins = Math.floor(elapsed / 60)
  const secs = elapsed % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}
</script>
