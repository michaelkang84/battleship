import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type {
  GamePhase,
  Difficulty,
  ViewMode,
  StatusMode,
  Orientation,
  Board,
  Ship,
  ShipType,
  GameMove,
  Coordinates,
} from '@/game/types'
import { BOARD_SIZE, CELL_STATE, SHIP_TYPES } from '@/constants/game'
import {
  createEmptyBoard,
  placeShipsRandomly,
  attackCell,
  areAllShipsSunk,
} from '@/game/engine/board'
import { getAIMove, updateAIState, resetAI } from '@/game/ai/aiPlayer'

export const useGameStore = defineStore('game', () => {
  // Game phase
  const gamePhase = ref<GamePhase>('options')
  const difficulty = ref<Difficulty>('medium')

  // UI state
  const viewMode = ref<ViewMode>('split')
  const statusMode = ref<StatusMode>('default')
  const boardRotation = ref(0)
  const message = ref('')
  const isProcessing = ref(false)

  // Board state
  const playerBoard = ref<Board>(createEmptyBoard())
  const opponentBoard = ref<Board>(createEmptyBoard())

  // Ship state
  const playerShips = ref<Ship[]>([])
  const opponentShips = ref<Ship[]>([])

  // Move history
  const moveHistory = ref<GameMove[]>([])

  // Ship placement
  const placedShips = ref<Record<string, boolean>>({})
  const placementOrientation = ref<Orientation>('horizontal')

  // Turn tracking
  const currentTurn = ref<'player' | 'opponent'>('player')

  // Computed
  const turnCount = computed(() => Math.floor(moveHistory.value.length / 2) + 1)
  const playerShipsRemaining = computed(() => playerShips.value.filter(s => !s.isSunk).length)
  const opponentShipsRemaining = computed(() => opponentShips.value.filter(s => !s.isSunk).length)
  const allShipsPlaced = computed(
    () => Object.keys(placedShips.value).length === Object.keys(SHIP_TYPES).length
  )
  const isFocusMode = computed(
    () => viewMode.value === 'opponent' && statusMode.value === 'minimized'
  )

  // Actions
  function setDifficulty(d: Difficulty) {
    difficulty.value = d
  }

  function setPhase(phase: GamePhase) {
    gamePhase.value = phase
    if (phase === 'battle') {
      message.value = ''
    }
  }

  function setViewMode(mode: ViewMode) {
    viewMode.value = mode
  }

  function setStatusMode(mode: StatusMode) {
    statusMode.value = mode
  }

  function toggleFocusMode() {
    if (isFocusMode.value) {
      viewMode.value = 'split'
      statusMode.value = 'default'
    } else {
      viewMode.value = 'opponent'
      statusMode.value = 'minimized'
    }
  }

  function rotateBoard() {
    boardRotation.value = (boardRotation.value + 90) % 360
  }

  function togglePlacementOrientation() {
    placementOrientation.value =
      placementOrientation.value === 'horizontal' ? 'vertical' : 'horizontal'
  }

  function placeShip(shipType: ShipType, startRow: number, startCol: number): boolean {
    const config = SHIP_TYPES[shipType]
    const coordinates: Coordinates[] = []

    for (let i = 0; i < config.length; i++) {
      const row = placementOrientation.value === 'horizontal' ? startRow : startRow + i
      const col = placementOrientation.value === 'horizontal' ? startCol + i : startCol

      if (row >= BOARD_SIZE || col >= BOARD_SIZE) return false
      if (playerBoard.value[row][col].hasShip) return false

      coordinates.push({ row, col })
    }

    coordinates.forEach(({ row, col }) => {
      playerBoard.value[row][col].hasShip = true
      playerBoard.value[row][col].shipId = shipType
    })

    playerShips.value.push({
      type: shipType,
      length: config.length,
      coordinates,
      hits: 0,
      isSunk: false,
    })

    placedShips.value = { ...placedShips.value, [shipType]: true }
    return true
  }

  function clearAllShips() {
    playerBoard.value = createEmptyBoard()
    playerShips.value = []
    placedShips.value = {}
  }

  function randomizePlacement() {
    clearAllShips()
    const board = createEmptyBoard()
    const ships = placeShipsRandomly(board)
    playerBoard.value = board
    playerShips.value = ships
    const placed: Record<string, boolean> = {}
    ships.forEach(s => {
      placed[s.type] = true
    })
    placedShips.value = placed
  }

  function startBattle() {
    const aiBoard = createEmptyBoard()
    const aiShips = placeShipsRandomly(aiBoard)
    opponentBoard.value = aiBoard
    opponentShips.value = aiShips
    currentTurn.value = 'player'
    moveHistory.value = []
    message.value = ''
    resetAI()
  }

  async function playerAttack(coordinates: Coordinates): Promise<void> {
    if (isProcessing.value || currentTurn.value !== 'player' || gamePhase.value !== 'battle') return

    const cell = opponentBoard.value[coordinates.row][coordinates.col]
    if (cell.state === CELL_STATE.HIT || cell.state === CELL_STATE.MISS) return

    isProcessing.value = true

    const result = attackCell(
      opponentBoard.value,
      opponentShips.value,
      coordinates.row,
      coordinates.col
    )

    const move: GameMove = {
      player: 'player',
      coordinates,
      result: result.hit ? 'hit' : 'miss',
      shipType: result.shipType,
      sunk: result.sunk,
      timestamp: Date.now(),
    }
    moveHistory.value.push(move)

    if (result.hit) {
      message.value = result.sunk ? `You sunk their ${result.shipType}! 🔥` : 'Direct hit! 💥'
    } else {
      message.value = 'Miss! 🌊'
    }

    if (areAllShipsSunk(opponentShips.value)) {
      gamePhase.value = 'gameOver'
      message.value = '🎉 Victory! You sunk the entire enemy fleet!'
      isProcessing.value = false
      return
    }

    currentTurn.value = 'opponent'

    await new Promise(resolve => setTimeout(resolve, 800))
    await executeAITurn()

    isProcessing.value = false
  }

  async function executeAITurn(): Promise<void> {
    const aiMove = getAIMove(playerBoard.value)

    await new Promise(resolve => setTimeout(resolve, 500))

    const result = attackCell(playerBoard.value, playerShips.value, aiMove.row, aiMove.col)

    updateAIState(result.hit, result.sunk, aiMove)

    const move: GameMove = {
      player: 'opponent',
      coordinates: aiMove,
      result: result.hit ? 'hit' : 'miss',
      shipType: result.shipType,
      sunk: result.sunk,
      timestamp: Date.now(),
    }
    moveHistory.value.push(move)

    if (result.hit) {
      message.value = result.sunk ? `AI sunk your ${result.shipType}! 😰` : 'AI hit your ship! 😬'
    } else {
      message.value = 'AI missed! 😌'
    }

    if (areAllShipsSunk(playerShips.value)) {
      gamePhase.value = 'gameOver'
      message.value = '💀 Defeat! Your fleet has been destroyed!'
      return
    }

    currentTurn.value = 'player'
  }

  function resetGame() {
    gamePhase.value = 'options'
    difficulty.value = 'medium'
    viewMode.value = 'split'
    statusMode.value = 'default'
    boardRotation.value = 0
    message.value = ''
    isProcessing.value = false
    playerBoard.value = createEmptyBoard()
    opponentBoard.value = createEmptyBoard()
    playerShips.value = []
    opponentShips.value = []
    moveHistory.value = []
    placedShips.value = {}
    placementOrientation.value = 'horizontal'
    currentTurn.value = 'player'
    resetAI()
  }

  return {
    // State
    gamePhase,
    difficulty,
    viewMode,
    statusMode,
    boardRotation,
    message,
    isProcessing,
    playerBoard,
    opponentBoard,
    playerShips,
    opponentShips,
    moveHistory,
    placedShips,
    placementOrientation,
    currentTurn,
    // Computed
    turnCount,
    playerShipsRemaining,
    opponentShipsRemaining,
    allShipsPlaced,
    isFocusMode,
    // Actions
    setDifficulty,
    setPhase,
    setViewMode,
    setStatusMode,
    toggleFocusMode,
    rotateBoard,
    togglePlacementOrientation,
    placeShip,
    clearAllShips,
    randomizePlacement,
    startBattle,
    playerAttack,
    resetGame,
  }
})
