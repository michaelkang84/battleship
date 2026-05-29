<template>
  <div class="game-board">
    <h3 class="mb-4 text-xl font-semibold">{{ title }}</h3>
    <div class="grid gap-1" :style="gridStyle">
      <div
        v-for="(row, rowIndex) in board"
        :key="`row-${rowIndex}`"
        class="contents"
      >
        <button
          v-for="(cell, colIndex) in row"
          :key="`cell-${rowIndex}-${colIndex}`"
          :class="getCellClass(cell, rowIndex, colIndex)"
          :disabled="!isClickable || isProcessing"
          @click="handleCellClick(rowIndex, colIndex)"
          class="cell aspect-square rounded border-2 transition-all duration-200 hover:scale-105 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          <span v-if="showCellContent(cell)" class="text-xs font-bold">
            {{ getCellSymbol(cell) }}
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Board, Cell } from '@/game/types'
import { CELL_STATE } from '@/constants/game'

interface Props {
  board: Board
  title: string
  isClickable?: boolean
  showShips?: boolean
  isProcessing?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isClickable: false,
  showShips: false,
  isProcessing: false,
})

const emit = defineEmits<{
  cellClick: [row: number, col: number]
}>()

const gridStyle = computed(() => ({
  gridTemplateColumns: `repeat(${props.board[0]?.length || 10}, minmax(0, 1fr))`,
}))

function getCellClass(cell: Cell, row: number, col: number): string {
  const classes = ['border-slate-600']

  if (cell.state === CELL_STATE.HIT) {
    classes.push('bg-red-500 border-red-700')
  } else if (cell.state === CELL_STATE.MISS) {
    classes.push('bg-blue-300 border-blue-500')
  } else if (cell.hasShip && props.showShips) {
    classes.push('bg-slate-700 border-slate-500')
  } else {
    classes.push('bg-slate-800 border-slate-700 hover:bg-slate-700')
  }

  if (props.isClickable && cell.state === CELL_STATE.EMPTY && !props.isProcessing) {
    classes.push('cursor-pointer')
  } else if (props.isClickable && cell.state === CELL_STATE.SHIP && !props.isProcessing) {
    classes.push('cursor-pointer')
  }

  return classes.join(' ')
}

function showCellContent(cell: Cell): boolean {
  return cell.state === CELL_STATE.HIT || cell.state === CELL_STATE.MISS
}

function getCellSymbol(cell: Cell): string {
  if (cell.state === CELL_STATE.HIT) return '✕'
  if (cell.state === CELL_STATE.MISS) return '○'
  return ''
}

function handleCellClick(row: number, col: number): void {
  if (props.isClickable && !props.isProcessing) {
    emit('cellClick', row, col)
  }
}
</script>

<style scoped>
.game-board {
  @apply flex flex-col;
}

.cell {
  min-width: 2rem;
  min-height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
