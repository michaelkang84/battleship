<template>
  <div class="relative min-h-screen bg-gradient-game">
    <!-- Phase: Options -->
    <Transition name="phase" mode="out-in">
      <div
        v-if="store.gamePhase === 'options'"
        key="options"
        class="flex min-h-screen items-center justify-center p-6"
      >
        <div class="w-full max-w-2xl">
          <!-- Back link -->
          <RouterLink
            to="/"
            class="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            ← Back to Home
          </RouterLink>

          <div class="animate-slide-up text-center">
            <h1 class="mb-2 text-4xl font-black text-gradient">Choose Your Challenge</h1>
            <p class="mb-8 text-muted-foreground">Select the difficulty for your AI opponent</p>
          </div>

          <div
            class="animate-slide-up grid grid-cols-1 gap-4 sm:grid-cols-3"
            style="animation-delay: 0.15s; opacity: 0"
          >
            <button
              v-for="(config, key) in DIFFICULTY_LEVELS"
              :key="key"
              :class="[
                'group rounded-2xl border-2 p-6 text-center transition-all duration-300',
                store.difficulty === key
                  ? 'border-primary bg-primary/10 shadow-glow'
                  : 'border-border/30 bg-card/50 hover:border-primary/30 hover:bg-card/80',
              ]"
              @click="store.setDifficulty(key as Difficulty)"
            >
              <div class="mb-3 text-4xl">{{ config.icon }}</div>
              <h3 class="mb-1 text-lg font-bold">{{ config.name }}</h3>
              <p class="text-xs text-muted-foreground">{{ config.description }}</p>
              <div
                v-if="store.difficulty === key"
                class="mx-auto mt-3 h-1 w-8 rounded-full bg-primary transition-all"
              />
            </button>
          </div>

          <div class="animate-slide-up mt-8 text-center" style="animation-delay: 0.3s; opacity: 0">
            <Button size="lg" @click="store.setPhase('placement')">
              Continue to Ship Placement →
            </Button>
          </div>
        </div>
      </div>

      <!-- Phase: Ship Placement -->
      <div v-else-if="store.gamePhase === 'placement'" key="placement" class="min-h-screen p-6">
        <div class="mx-auto max-w-5xl">
          <div class="mb-6 flex items-center justify-between">
            <div>
              <button
                class="mb-2 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                @click="store.setPhase('options')"
              >
                ← Back to Options
              </button>
              <h1 class="text-3xl font-black text-gradient">Place Your Fleet</h1>
              <p class="mt-1 text-sm text-muted-foreground">
                Position your ships on the grid. Press R to rotate.
              </p>
            </div>

            <Button
              v-if="store.allShipsPlaced"
              size="lg"
              class="animate-bounce-in"
              @click="handleReadyForBattle"
            >
              Ready for Battle! ⚔️
            </Button>
          </div>

          <ShipPlacement
            :board="store.playerBoard"
            :placed-ships="store.placedShips"
            :orientation="store.placementOrientation"
            @place-ship="handlePlaceShip"
            @rotate="store.togglePlacementOrientation()"
            @randomize="store.randomizePlacement()"
            @clear-all="store.clearAllShips()"
          />
        </div>
      </div>

      <!-- Phase: Countdown -->
      <div v-else-if="store.gamePhase === 'countdown'" key="countdown">
        <CountdownOverlay @complete="handleCountdownComplete" />
      </div>

      <!-- Phase: Battle -->
      <div v-else-if="store.gamePhase === 'battle'" key="battle" class="min-h-screen p-4 md:p-6">
        <div class="mx-auto max-w-7xl">
          <!-- Top bar -->
          <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h1 class="text-xl font-bold text-foreground">
              ⚓ <span class="text-gradient">Battle</span>
            </h1>
            <BoardControls
              :current-view="store.viewMode"
              :rotation="store.boardRotation"
              :is-focused="store.isFocusMode"
              @view-change="store.setViewMode"
              @rotate="store.rotateBoard()"
              @toggle-focus="store.toggleFocusMode()"
            />
            <button
              class="text-sm text-muted-foreground transition-colors hover:text-foreground"
              @click="confirmQuit"
            >
              Quit Game
            </button>
          </div>

          <!-- Game Status -->
          <div class="mb-4">
            <GameStatus
              :mode="store.statusMode"
              :is-player-turn="store.currentTurn === 'player'"
              :turn-count="store.turnCount"
              :player-ships="store.playerShips"
              :opponent-ships="store.opponentShips"
              :move-history="store.moveHistory"
              :message="store.message"
              @change-mode="store.setStatusMode"
            />
          </div>

          <!-- Boards -->
          <div class="grid gap-6 transition-all duration-500" :class="boardGridClass">
            <!-- Player Board -->
            <Transition name="board">
              <div v-if="showPlayerBoard" key="player-board">
                <GameBoard
                  :board="store.playerBoard"
                  title="Your Fleet"
                  :show-ships="true"
                  :rotation="store.boardRotation"
                  :compact="store.viewMode === 'split'"
                  variant="player"
                />
              </div>
            </Transition>

            <!-- Opponent Board -->
            <Transition name="board">
              <div v-if="showOpponentBoard" key="opponent-board">
                <GameBoard
                  :board="store.opponentBoard"
                  title="Enemy Waters"
                  :is-clickable="store.currentTurn === 'player'"
                  :is-processing="store.isProcessing"
                  :rotation="store.boardRotation"
                  :compact="store.viewMode === 'split'"
                  variant="opponent"
                  @cell-click="handleAttack"
                />
              </div>
            </Transition>
          </div>
        </div>
      </div>

      <!-- Phase: Game Over -->
      <div
        v-else-if="store.gamePhase === 'gameOver'"
        key="gameover"
        class="flex min-h-screen items-center justify-center p-6"
      >
        <div class="animate-scale-in text-center" style="opacity: 0">
          <div class="mb-4 text-6xl">
            {{ hasPlayerWon ? '🎉' : '💀' }}
          </div>
          <h1 class="mb-2 text-5xl font-black text-gradient">
            {{ hasPlayerWon ? 'Victory!' : 'Defeat!' }}
          </h1>
          <p class="mb-2 text-lg text-muted-foreground">
            {{ store.message }}
          </p>
          <p class="mb-8 text-sm text-muted-foreground">Game lasted {{ store.turnCount }} turns</p>
          <div class="flex justify-center gap-4">
            <Button size="lg" @click="store.resetGame()"> Play Again </Button>
            <RouterLink to="/">
              <Button variant="outline" size="lg"> Home </Button>
            </RouterLink>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Step indicator -->
    <div
      v-if="store.gamePhase !== 'countdown' && store.gamePhase !== 'gameOver'"
      class="fixed bottom-6 left-1/2 z-20 -translate-x-1/2"
    >
      <div
        class="flex items-center gap-2 rounded-full border border-border/30 bg-card/80 px-4 py-2 backdrop-blur-sm"
      >
        <div v-for="(step, index) in steps" :key="step.key" class="flex items-center gap-2">
          <div
            class="flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold transition-all duration-300"
            :class="getStepClass(step.key)"
          >
            {{ isStepComplete(step.key) ? '✓' : index + 1 }}
          </div>
          <span
            class="hidden text-xs font-medium sm:inline"
            :class="store.gamePhase === step.key ? 'text-foreground' : 'text-muted-foreground/60'"
          >
            {{ step.label }}
          </span>
          <div v-if="index < steps.length - 1" class="h-px w-6 bg-border/30" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import type { Difficulty, ShipType, GamePhase } from '@/game/types'
import { DIFFICULTY_LEVELS } from '@/constants/game'
import { useGameStore } from '@/stores/gameStore'
import Button from '@/components/ui/Button.vue'
import GameBoard from '@/components/game/GameBoard.vue'
import ShipPlacement from '@/components/game/ShipPlacement.vue'
import CountdownOverlay from '@/components/game/CountdownOverlay.vue'
import GameStatus from '@/components/game/GameStatus.vue'
import BoardControls from '@/components/game/BoardControls.vue'

const store = useGameStore()

const steps = [
  { key: 'options' as GamePhase, label: 'Options' },
  { key: 'placement' as GamePhase, label: 'Place Ships' },
  { key: 'battle' as GamePhase, label: 'Battle' },
]

const phaseOrder: GamePhase[] = ['options', 'placement', 'countdown', 'battle', 'gameOver']

const showPlayerBoard = computed(() => store.viewMode === 'split' || store.viewMode === 'player')
const showOpponentBoard = computed(
  () => store.viewMode === 'split' || store.viewMode === 'opponent'
)

const boardGridClass = computed(() => {
  if (store.viewMode === 'split') return 'grid-cols-1 lg:grid-cols-2'
  return 'grid-cols-1 max-w-xl mx-auto'
})

const hasPlayerWon = computed(() => store.message.includes('Victory'))

function isStepComplete(phase: GamePhase): boolean {
  const currentIndex = phaseOrder.indexOf(store.gamePhase)
  const phaseIndex = phaseOrder.indexOf(phase)
  return currentIndex > phaseIndex
}

function getStepClass(phase: GamePhase): string {
  if (store.gamePhase === phase) return 'bg-primary text-primary-foreground'
  if (isStepComplete(phase)) return 'bg-primary/20 text-primary'
  return 'bg-muted text-muted-foreground'
}

function handlePlaceShip(type: ShipType, row: number, col: number) {
  store.placeShip(type, row, col)
}

function handleReadyForBattle() {
  store.startBattle()
  store.setPhase('countdown')
}

function handleCountdownComplete() {
  store.setPhase('battle')
}

function handleAttack(row: number, col: number) {
  store.playerAttack({ row, col })
}

function confirmQuit() {
  if (window.confirm('Are you sure you want to quit the current game?')) {
    store.resetGame()
  }
}
</script>

<style scoped>
.phase-enter-active {
  transition: all 0.4s ease-out;
}

.phase-leave-active {
  transition: all 0.2s ease-in;
}

.phase-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.phase-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.board-enter-active {
  transition: all 0.4s ease-out;
}

.board-leave-active {
  transition: all 0.2s ease-in;
}

.board-enter-from {
  opacity: 0;
  transform: scale(0.95);
}

.board-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
