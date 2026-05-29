<template>
  <Transition name="status" mode="out-in">
    <!-- Minimized view -->
    <div
      v-if="mode === 'minimized'"
      key="minimized"
      class="flex items-center justify-between rounded-lg border border-border/30 bg-card/80 px-4 py-2 backdrop-blur-sm"
    >
      <div class="flex items-center gap-4">
        <Badge :variant="isPlayerTurn ? 'default' : 'accent'" size="sm">
          {{ isPlayerTurn ? 'Your Turn' : 'AI Turn' }}
        </Badge>
        <span class="text-xs text-muted-foreground">
          Turn {{ turnCount }} · Ships: {{ playerShipsAlive }}/{{ totalShips }} vs
          {{ opponentShipsAlive }}/{{ totalShips }}
        </span>
      </div>
      <div class="flex items-center gap-2">
        <button
          class="rounded-md px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          @click="$emit('changeMode', 'default')"
        >
          Expand
        </button>
      </div>
    </div>

    <!-- Default view -->
    <div
      v-else-if="mode === 'default'"
      key="default"
      class="rounded-xl border border-border/30 bg-card/80 p-4 backdrop-blur-sm"
    >
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-2">
            <div
              class="h-3 w-3 rounded-full transition-colors"
              :class="isPlayerTurn ? 'bg-primary animate-pulse' : 'bg-muted-foreground/30'"
            />
            <span class="text-sm font-semibold">
              {{ isPlayerTurn ? 'Your Turn' : "AI's Turn" }}
            </span>
          </div>
          <Badge variant="outline" size="sm">Turn {{ turnCount }}</Badge>
        </div>

        <div class="flex gap-1">
          <button
            class="rounded-md px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            @click="$emit('changeMode', 'detailed')"
          >
            Details
          </button>
          <button
            class="rounded-md px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            @click="$emit('changeMode', 'minimized')"
          >
            Minimize
          </button>
        </div>
      </div>

      <div class="mt-3 grid grid-cols-2 gap-4">
        <div class="rounded-lg bg-muted/30 p-3">
          <div class="mb-1 text-xs font-semibold text-muted-foreground">Your Fleet</div>
          <div class="flex items-baseline gap-1">
            <span class="text-2xl font-bold text-primary">{{ playerShipsAlive }}</span>
            <span class="text-sm text-muted-foreground">/{{ totalShips }} ships</span>
          </div>
        </div>
        <div class="rounded-lg bg-muted/30 p-3">
          <div class="mb-1 text-xs font-semibold text-muted-foreground">Enemy Fleet</div>
          <div class="flex items-baseline gap-1">
            <span class="text-2xl font-bold text-accent">{{ opponentShipsAlive }}</span>
            <span class="text-sm text-muted-foreground">/{{ totalShips }} ships</span>
          </div>
        </div>
      </div>

      <div v-if="message" class="mt-3 rounded-lg bg-primary/5 px-3 py-2">
        <p class="text-sm font-medium text-foreground">{{ message }}</p>
      </div>
    </div>

    <!-- Detailed view -->
    <div
      v-else
      key="detailed"
      class="rounded-xl border border-border/30 bg-card/80 p-4 backdrop-blur-sm"
    >
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div
            class="h-3 w-3 rounded-full transition-colors"
            :class="isPlayerTurn ? 'bg-primary animate-pulse' : 'bg-muted-foreground/30'"
          />
          <span class="text-sm font-semibold">
            {{ isPlayerTurn ? 'Your Turn' : "AI's Turn" }}
          </span>
          <Badge variant="outline" size="sm">Turn {{ turnCount }}</Badge>
        </div>

        <div class="flex gap-1">
          <button
            class="rounded-md px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            @click="$emit('changeMode', 'default')"
          >
            Collapse
          </button>
          <button
            class="rounded-md px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            @click="$emit('changeMode', 'minimized')"
          >
            Minimize
          </button>
        </div>
      </div>

      <div class="mt-3 grid grid-cols-2 gap-4">
        <!-- Player Fleet Status -->
        <div>
          <h4 class="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Your Fleet
          </h4>
          <ShipFleet :ships="playerShips" variant="player" />
        </div>

        <!-- Opponent Fleet Status -->
        <div>
          <h4 class="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Enemy Fleet
          </h4>
          <ShipFleet :ships="opponentShips" variant="opponent" />
        </div>
      </div>

      <!-- Move History -->
      <div v-if="moveHistory.length > 0" class="mt-4">
        <h4 class="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Battle Log
        </h4>
        <MoveHistory :moves="moveHistory" />
      </div>

      <div v-if="message" class="mt-3 rounded-lg bg-primary/5 px-3 py-2">
        <p class="text-sm font-medium text-foreground">{{ message }}</p>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import type { Ship, GameMove, StatusMode } from '@/game/types'
import { SHIP_TYPES } from '@/constants/game'
import Badge from '@/components/ui/Badge.vue'
import ShipFleet from './ShipFleet.vue'
import MoveHistory from './MoveHistory.vue'

interface Props {
  mode: StatusMode
  isPlayerTurn: boolean
  turnCount: number
  playerShips: Ship[]
  opponentShips: Ship[]
  moveHistory: GameMove[]
  message: string
}

const props = defineProps<Props>()

defineEmits<{
  changeMode: [mode: StatusMode]
}>()

const totalShips = Object.keys(SHIP_TYPES).length

const playerShipsAlive = props.playerShips.filter(s => !s.isSunk).length
const opponentShipsAlive = props.opponentShips.filter(s => !s.isSunk).length
</script>

<style scoped>
.status-enter-active {
  transition: all 0.3s ease-out;
}

.status-leave-active {
  transition: all 0.2s ease-in;
}

.status-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.status-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
