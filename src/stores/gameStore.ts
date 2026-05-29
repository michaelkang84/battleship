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
  ShipSunkNotification,
  PowerType,
} from '@/game/types'
import { BOARD_SIZE, CELL_STATE, SHIP_TYPES } from '@/constants/game'
import {
  createEmptyBoard,
  placeShipsRandomly,
  attackCell,
  areAllShipsSunk,
} from '@/game/engine/board'
import { getSonarArea, getAirstrikeArea } from '@/game/engine/powers'
import { getAIMove, updateAIState, resetAI } from '@/game/ai/aiPlayer'
import { useHistoryStore } from '@/stores/historyStore'

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

  // Ship-sunk notifications (transient toasts)
  const shipSunkNotifications = ref<ShipSunkNotification[]>([])
  let notificationId = 0

  // Special Ordnance (optional per-ship powers, off by default)
  const specialOrdnanceEnabled = ref(false)
  const powerUsed = ref<Record<PowerType, boolean>>({
    sonar: false,
    airstrike: false,
    salvo: false,
  })
  // Sonar/Airstrike awaiting a target selection on the enemy grid.
  const activePower = ref<PowerType | null>(null)
  // Shots left in an armed Salvo (2 -> 1 -> 0).
  const salvoShotsRemaining = ref(0)

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
    // If we're in focus mode and switching to a different view, exit focus
    // mode first by restoring the status panel.
    if (isFocusMode.value && mode !== viewMode.value) {
      statusMode.value = 'default'
    }
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
    shipSunkNotifications.value = []
    resetPowers()
    message.value = ''
    resetAI()
  }

  function setSpecialOrdnance(enabled: boolean) {
    specialOrdnanceEnabled.value = enabled
  }

  function resetPowers() {
    powerUsed.value = { sonar: false, airstrike: false, salvo: false }
    activePower.value = null
    salvoShotsRemaining.value = 0
  }

  // Select a power: arm Salvo immediately, or toggle targeting for Sonar/Airstrike.
  function selectPower(power: PowerType) {
    if (!specialOrdnanceEnabled.value) return
    if (isProcessing.value || currentTurn.value !== 'player' || gamePhase.value !== 'battle') return
    if (powerUsed.value[power] || salvoShotsRemaining.value > 0) return

    if (power === 'salvo') {
      powerUsed.value = { ...powerUsed.value, salvo: true }
      salvoShotsRemaining.value = 2
      activePower.value = null
      message.value = 'Salvo armed — fire 2 shots! 🎯'
      return
    }

    activePower.value = activePower.value === power ? null : power
    if (activePower.value === 'sonar') {
      message.value = 'Sonar ready — select a 3×3 sector to scan 📡'
    } else if (activePower.value === 'airstrike') {
      message.value = 'Airstrike ready — select a 1×3 line to recon ✈️'
    }
  }

  function cancelPower() {
    activePower.value = null
  }

  async function useSonar(anchor: Coordinates): Promise<void> {
    if (activePower.value !== 'sonar') return
    if (isProcessing.value || currentTurn.value !== 'player' || gamePhase.value !== 'battle') return

    isProcessing.value = true
    activePower.value = null
    powerUsed.value = { ...powerUsed.value, sonar: true }

    const area = getSonarArea(anchor)
    const contact = area.some(({ row, col }) => {
      const cell = opponentBoard.value[row][col]
      return cell.hasShip && cell.state !== CELL_STATE.HIT
    })

    // Persist area intel on undiscovered cells (don't override exact intel or fired cells).
    for (const { row, col } of area) {
      const cell = opponentBoard.value[row][col]
      if (cell.state === CELL_STATE.EMPTY && cell.intel !== 'ship' && cell.intel !== 'empty') {
        cell.intel = contact ? 'contact' : 'clear'
      }
    }

    message.value = contact
      ? 'Sonar: contact detected in the sector! 📡'
      : 'Sonar: sector clear — no ships. 🌊'

    currentTurn.value = 'opponent'
    await new Promise(resolve => setTimeout(resolve, 700))
    await executeAITurn()
    isProcessing.value = false
  }

  async function useAirstrike(anchor: Coordinates): Promise<void> {
    if (activePower.value !== 'airstrike') return
    if (isProcessing.value || currentTurn.value !== 'player' || gamePhase.value !== 'battle') return

    isProcessing.value = true
    activePower.value = null
    powerUsed.value = { ...powerUsed.value, airstrike: true }

    const area = getAirstrikeArea(anchor)
    let shipsFound = 0
    for (const { row, col } of area) {
      const cell = opponentBoard.value[row][col]
      if (cell.state !== CELL_STATE.EMPTY) continue
      if (cell.hasShip) {
        cell.intel = 'ship'
        shipsFound++
      } else {
        cell.intel = 'empty'
      }
    }

    message.value =
      shipsFound > 0
        ? `Airstrike recon: ${shipsFound} ship cell${shipsFound > 1 ? 's' : ''} located! ✈️`
        : 'Airstrike recon: nothing in that line. ✈️'

    currentTurn.value = 'opponent'
    await new Promise(resolve => setTimeout(resolve, 700))
    await executeAITurn()
    isProcessing.value = false
  }

  function notifyShipSunk(by: 'player' | 'opponent', shipType: string) {
    shipSunkNotifications.value.push({ id: notificationId++, by, shipType })
  }

  function dismissShipSunkNotification(id: number) {
    shipSunkNotifications.value = shipSunkNotifications.value.filter(n => n.id !== id)
  }

  async function playerAttack(coordinates: Coordinates): Promise<void> {
    if (isProcessing.value || currentTurn.value !== 'player' || gamePhase.value !== 'battle') return
    // Sonar/Airstrike targeting routes board clicks elsewhere.
    if (activePower.value !== null) return

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

    if (result.sunk && result.shipType) {
      notifyShipSunk('player', result.shipType)
    }

    if (areAllShipsSunk(opponentShips.value)) {
      gamePhase.value = 'gameOver'
      message.value = '🎉 Victory! You sunk the entire enemy fleet!'
      recordGameResult('victory')
      isProcessing.value = false
      return
    }

    // Salvo: take a second shot before the opponent responds.
    if (salvoShotsRemaining.value > 0) {
      salvoShotsRemaining.value -= 1
      if (salvoShotsRemaining.value > 0) {
        message.value += ' · Salvo: 1 shot left 🎯'
        isProcessing.value = false
        return
      }
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

    if (result.sunk && result.shipType) {
      notifyShipSunk('opponent', result.shipType)
    }

    if (areAllShipsSunk(playerShips.value)) {
      gamePhase.value = 'gameOver'
      message.value = '💀 Defeat! Your fleet has been destroyed!'
      recordGameResult('defeat')
      return
    }

    currentTurn.value = 'player'
  }

  function recordGameResult(result: 'victory' | 'defeat') {
    const historyStore = useHistoryStore()
    historyStore.addRecord({
      result,
      difficulty: difficulty.value,
      totalMoves: moveHistory.value.length,
      playerShipsRemaining: playerShips.value.filter(s => !s.isSunk).length,
      opponentShipsRemaining: opponentShips.value.filter(s => !s.isSunk).length,
    })
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
    shipSunkNotifications.value = []
    specialOrdnanceEnabled.value = false
    resetPowers()
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
    shipSunkNotifications,
    specialOrdnanceEnabled,
    powerUsed,
    activePower,
    salvoShotsRemaining,
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
    dismissShipSunkNotification,
    setSpecialOrdnance,
    selectPower,
    cancelPower,
    useSonar,
    useAirstrike,
  }
})
