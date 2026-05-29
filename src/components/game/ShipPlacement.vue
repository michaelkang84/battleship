<template>
  <div class="flex flex-col gap-6 lg:flex-row lg:gap-8">
    <!-- Ship Palette -->
    <div class="w-full lg:w-72">
      <div class="mb-4 flex items-center justify-between">
        <h3 class="text-sm font-bold uppercase tracking-wider text-muted-foreground">Your Fleet</h3>
        <Badge :variant="allShipsPlaced ? 'success' : 'default'">
          {{ placedCount }}/{{ totalShips }}
        </Badge>
      </div>

      <div class="space-y-2">
        <button
          v-for="(config, type) in SHIP_TYPES"
          :key="type"
          :class="[
            'flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-all duration-200',
            isShipPlaced(type as ShipType)
              ? 'border-primary/30 bg-primary/10 opacity-60'
              : selectedShip === type
                ? 'border-primary bg-primary/15 shadow-glow-sm'
                : 'border-border/50 bg-card/50 hover:border-primary/30 hover:bg-card',
          ]"
          :disabled="isShipPlaced(type as ShipType)"
          @click="selectShip(type as ShipType)"
        >
          <div class="flex gap-0.5">
            <div
              v-for="i in config.length"
              :key="i"
              class="h-5 w-5 rounded-sm transition-colors"
              :class="
                isShipPlaced(type as ShipType)
                  ? 'bg-primary/40'
                  : selectedShip === type
                    ? 'bg-primary'
                    : 'bg-muted-foreground/30'
              "
            />
          </div>
          <div class="flex-1">
            <div class="text-sm font-semibold">{{ config.name }}</div>
            <div class="text-xs text-muted-foreground">{{ config.length }} cells</div>
          </div>
          <span v-if="isShipPlaced(type as ShipType)" class="text-primary">✓</span>
        </button>
      </div>

      <!-- Controls -->
      <div class="mt-4 flex gap-2">
        <Button variant="outline" size="sm" class="flex-1" @click="handleRotate">
          <span class="mr-1">↻</span> Rotate (R)
        </Button>
        <Button variant="outline" size="sm" class="flex-1" @click="$emit('randomize')">
          <span class="mr-1">🎲</span> Random
        </Button>
      </div>
      <Button
        v-if="placedCount > 0"
        variant="ghost"
        size="sm"
        class="mt-2 w-full text-muted-foreground"
        @click="$emit('clearAll')"
      >
        Clear All
      </Button>
    </div>

    <!-- Board -->
    <div class="flex-1">
      <div class="mb-3 flex items-center gap-3">
        <div class="text-xs text-muted-foreground">
          <span v-if="selectedShip" class="text-primary">
            Placing: {{ SHIP_TYPES[selectedShip].name }}
            <span class="ml-1 text-muted-foreground">({{ orientation }})</span>
          </span>
          <span v-else class="italic"> Select a ship to place </span>
        </div>
      </div>

      <GameBoard
        :board="board"
        :show-ships="true"
        :is-clickable="!!selectedShip"
        :highlight-cells="previewCells"
        variant="player"
        @cell-click="handlePlacement"
        @cell-hover="handleHover"
        @cell-leave="clearPreview"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import type { Board, ShipType, Orientation } from '@/game/types'
import { SHIP_TYPES, BOARD_SIZE } from '@/constants/game'
import GameBoard from './GameBoard.vue'
import Button from '@/components/ui/Button.vue'
import Badge from '@/components/ui/Badge.vue'

interface Props {
  board: Board
  placedShips: Record<string, boolean>
  orientation: Orientation
}

const props = defineProps<Props>()

const emit = defineEmits<{
  placeShip: [type: ShipType, row: number, col: number]
  rotate: []
  randomize: []
  clearAll: []
}>()

const selectedShip = ref<ShipType | null>(null)
const previewCells = ref<{ row: number; col: number; valid: boolean }[]>([])

const totalShips = computed(() => Object.keys(SHIP_TYPES).length)
const placedCount = computed(() => Object.keys(props.placedShips).length)
const allShipsPlaced = computed(() => placedCount.value === totalShips.value)

function isShipPlaced(type: ShipType): boolean {
  return !!props.placedShips[type]
}

function selectShip(type: ShipType) {
  if (!isShipPlaced(type)) {
    selectedShip.value = selectedShip.value === type ? null : type
    previewCells.value = []
  }
}

function handleRotate() {
  emit('rotate')
}

function getPreviewCells(
  type: ShipType,
  row: number,
  col: number
): { row: number; col: number; valid: boolean }[] {
  const config = SHIP_TYPES[type]
  const cells: { row: number; col: number; valid: boolean }[] = []
  let allValid = true

  for (let i = 0; i < config.length; i++) {
    const r = props.orientation === 'horizontal' ? row : row + i
    const c = props.orientation === 'horizontal' ? col + i : col

    if (r >= BOARD_SIZE || c >= BOARD_SIZE) {
      allValid = false
      continue
    }

    if (props.board[r][c].hasShip) {
      allValid = false
    }

    cells.push({ row: r, col: c, valid: true })
  }

  if (!allValid) {
    return cells.map(c => ({ ...c, valid: false }))
  }

  return cells
}

function handleHover(row: number, col: number) {
  if (selectedShip.value) {
    previewCells.value = getPreviewCells(selectedShip.value, row, col)
  }
}

function clearPreview() {
  previewCells.value = []
}

function handlePlacement(row: number, col: number) {
  if (!selectedShip.value) return

  const preview = getPreviewCells(selectedShip.value, row, col)
  if (preview.length > 0 && preview.every(c => c.valid)) {
    emit('placeShip', selectedShip.value, row, col)

    const types = Object.keys(SHIP_TYPES) as ShipType[]
    const nextUnplaced = types.find(t => t !== selectedShip.value && !isShipPlaced(t))
    selectedShip.value = nextUnplaced || null
    previewCells.value = []
  }
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'r' || e.key === 'R') {
    handleRotate()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
  const types = Object.keys(SHIP_TYPES) as ShipType[]
  const firstUnplaced = types.find(t => !isShipPlaced(t))
  if (firstUnplaced) {
    selectedShip.value = firstUnplaced
  }
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>
