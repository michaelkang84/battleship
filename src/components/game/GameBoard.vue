<template>
  <div class="game-board" :class="boardWrapperClass">
    <h3
      v-if="title"
      class="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted-foreground"
    >
      <span class="inline-block h-2 w-2 rounded-full" :class="titleDotColor" />
      {{ title }}
    </h3>

    <div
      class="board-grid-wrapper relative rounded-xl border border-border/50 bg-card/50 p-2 shadow-sm transition-transform duration-500"
      :style="{ transform: `rotate(${rotation}deg)` }"
    >
      <!-- Loading overlay while the AI is making its move -->
      <Transition name="processing-fade">
        <div
          v-if="isProcessing"
          class="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-foreground/10 backdrop-blur-[1px]"
          :style="{ transform: `rotate(-${rotation}deg)` }"
        >
          <div
            class="flex items-center gap-2 rounded-full border border-border/40 bg-card/90 px-4 py-2 shadow-sm"
          >
            <span
              class="h-3 w-3 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-muted-foreground/80"
            />
            <span class="text-xs font-medium text-muted-foreground">Opponent is thinking…</span>
          </div>
        </div>
      </Transition>

      <!-- Full board grid (labels + cells) -->
      <div class="board-grid" :style="boardGridStyle">
        <!-- Top-left corner spacer -->
        <div />
        <!-- Column labels -->
        <div
          v-for="col in colLabels"
          :key="'col-' + col"
          class="flex items-center justify-center text-[10px] font-bold text-muted-foreground/70"
          :style="{ transform: `rotate(-${rotation}deg)` }"
        >
          {{ col }}
        </div>

        <!-- Board rows -->
        <template v-for="(row, rowIndex) in board" :key="'row-' + rowIndex">
          <!-- Row label -->
          <div
            class="flex items-center justify-center text-[10px] font-bold text-muted-foreground/70"
            :style="{ transform: `rotate(-${rotation}deg)` }"
          >
            {{ rowLabels[rowIndex] }}
          </div>

          <!-- Cells -->
          <button
            v-for="(cell, colIndex) in row"
            :key="'cell-' + rowIndex + '-' + colIndex"
            :class="getCellClass(cell, rowIndex, colIndex)"
            :disabled="!isClickable || isProcessing"
            class="board-cell flex aspect-square items-center justify-center text-xs font-bold"
            @click="handleCellClick(rowIndex, colIndex)"
            @mouseenter="handleCellHover(rowIndex, colIndex)"
            @mouseleave="handleCellLeave"
          >
            <span v-if="cell.state === 'hit'" class="animate-cell-hit">💥</span>
            <span v-else-if="cell.state === 'miss'" class="animate-cell-miss text-blue-400/60"
              >•</span
            >
            <span
              v-else-if="cell.hasShip && showShips"
              class="h-3/4 w-3/4 rounded-sm bg-primary/70"
            />
            <span
              v-else-if="showCoordinates"
              class="select-none text-[9px] font-medium tracking-tight text-muted-foreground/25"
            >
              {{ colLabels[colIndex] }}{{ rowLabels[rowIndex] }}
            </span>
          </button>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Board, Cell } from '@/game/types'
import { CELL_STATE, COL_LABELS, ROW_LABELS } from '@/constants/game'

interface Props {
  board: Board
  title?: string
  isClickable?: boolean
  showShips?: boolean
  isProcessing?: boolean
  rotation?: number
  compact?: boolean
  showCoordinates?: boolean
  highlightCells?: { row: number; col: number; valid: boolean }[]
  variant?: 'player' | 'opponent'
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  isClickable: false,
  showShips: false,
  isProcessing: false,
  rotation: 0,
  compact: false,
  showCoordinates: false,
  highlightCells: () => [],
  variant: 'player',
})

const emit = defineEmits<{
  cellClick: [row: number, col: number]
  cellHover: [row: number, col: number]
  cellLeave: []
}>()

const rowLabels = ROW_LABELS
const colLabels = COL_LABELS

const boardSize = computed(() => props.board[0]?.length || 10)

const titleDotColor = computed(() => (props.variant === 'player' ? 'bg-primary' : 'bg-accent'))

const boardWrapperClass = computed(() =>
  props.compact ? 'w-full mx-auto max-w-[36rem]' : 'w-full mx-auto max-w-xl'
)

const boardGridStyle = computed(() => ({
  display: 'grid',
  gridTemplateColumns: `1.75rem repeat(${boardSize.value}, 1fr)`,
  gap: '2px',
}))

function isHighlighted(row: number, col: number): { highlighted: boolean; valid: boolean } {
  const cell = props.highlightCells.find(c => c.row === row && c.col === col)
  return { highlighted: !!cell, valid: cell?.valid ?? false }
}

function getCellClass(cell: Cell, row: number, col: number): string {
  const classes = ['border', 'border-border/30']
  const highlight = isHighlighted(row, col)

  if (cell.state === CELL_STATE.HIT) {
    classes.push('bg-red-500/30 border-red-500/50')
  } else if (cell.state === CELL_STATE.MISS) {
    classes.push('bg-blue-500/10 border-blue-500/20')
  } else if (highlight.highlighted) {
    classes.push(
      highlight.valid
        ? 'bg-primary/30 border-primary/50 scale-105'
        : 'bg-red-500/20 border-red-500/40'
    )
  } else if (cell.hasShip && props.showShips) {
    classes.push('bg-primary/15 border-primary/30')
  } else {
    classes.push('bg-muted/30 hover:bg-muted/60')
  }

  if (
    props.isClickable &&
    !props.isProcessing &&
    cell.state !== CELL_STATE.HIT &&
    cell.state !== CELL_STATE.MISS
  ) {
    classes.push('cursor-pointer')
  } else {
    classes.push('cursor-default')
  }

  return classes.join(' ')
}

function handleCellClick(row: number, col: number): void {
  if (props.isClickable && !props.isProcessing) {
    emit('cellClick', row, col)
  }
}

function handleCellHover(row: number, col: number): void {
  emit('cellHover', row, col)
}

function handleCellLeave(): void {
  emit('cellLeave')
}
</script>

<style scoped>
.game-board {
  @apply flex flex-col;
}

.board-grid-wrapper {
  overflow: visible;
  min-width: 0;
}

.board-cell {
  min-width: 0;
  min-height: 0;
}

.processing-fade-enter-active,
.processing-fade-leave-active {
  transition: opacity 0.25s ease;
}

.processing-fade-enter-from,
.processing-fade-leave-to {
  opacity: 0;
}
</style>
