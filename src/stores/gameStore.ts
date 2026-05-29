import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { GameState, Coordinates } from '@/game/types'
import { createNewGame, processPlayerAttack, processAIAttack } from '@/game/engine/gameEngine'
import { getAIMove, updateAIState, resetAI } from '@/game/ai/aiPlayer'

export const useGameStore = defineStore('game', () => {
  const gameState = ref<GameState | null>(null)
  const message = ref<string>('')
  const isProcessing = ref<boolean>(false)

  function initializeGame() {
    resetAI()
    gameState.value = createNewGame()
    message.value = 'Game started! Attack the enemy board.'
  }

  function resetGame() {
    resetAI()
    gameState.value = null
    message.value = ''
    isProcessing.value = false
  }

  async function playerAttack(coordinates: Coordinates): Promise<void> {
    if (!gameState.value || isProcessing.value) return

    isProcessing.value = true

    const result = processPlayerAttack(gameState.value, coordinates)
    
    if (!result.success) {
      message.value = result.message
      isProcessing.value = false
      return
    }

    message.value = result.message

    if (result.gameOver) {
      isProcessing.value = false
      return
    }

    await new Promise(resolve => setTimeout(resolve, 1000))

    if (gameState.value && gameState.value.currentTurn === 'ai') {
      await executeAITurn()
    }

    isProcessing.value = false
  }

  async function executeAITurn(): Promise<void> {
    if (!gameState.value) return

    const aiMove = getAIMove(gameState.value.playerBoard)
    
    await new Promise(resolve => setTimeout(resolve, 500))

    const result = processAIAttack(gameState.value, aiMove)
    
    updateAIState(result.hit, result.sunk, aiMove)
    
    message.value = result.message
  }

  return {
    gameState,
    message,
    isProcessing,
    initializeGame,
    resetGame,
    playerAttack,
  }
})
