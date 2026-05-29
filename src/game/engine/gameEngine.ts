import type { GameState, Coordinates } from '@/game/types'
import {
  createEmptyBoard,
  placeShipsRandomly,
  attackCell,
  areAllShipsSunk,
} from './board'

export function createNewGame(): GameState {
  const playerBoard = createEmptyBoard()
  const aiBoard = createEmptyBoard()

  const playerShips = placeShipsRandomly(playerBoard)
  const aiShips = placeShipsRandomly(aiBoard)

  return {
    playerBoard,
    aiBoard,
    playerShips,
    aiShips,
    currentTurn: 'player',
    gameStatus: 'playing',
  }
}

export function processPlayerAttack(
  gameState: GameState,
  coordinates: Coordinates
): {
  success: boolean
  hit: boolean
  sunk: boolean
  gameOver: boolean
  message: string
} {
  if (gameState.currentTurn !== 'player' || gameState.gameStatus !== 'playing') {
    return {
      success: false,
      hit: false,
      sunk: false,
      gameOver: false,
      message: 'Not your turn',
    }
  }

  const result = attackCell(
    gameState.aiBoard,
    gameState.aiShips,
    coordinates.row,
    coordinates.col
  )

  if (!result.hit && result.sunk === false && !result.shipType) {
    return {
      success: false,
      hit: false,
      sunk: false,
      gameOver: false,
      message: 'Already attacked this cell',
    }
  }

  let message = ''
  if (result.hit) {
    if (result.sunk) {
      message = `You sunk the enemy's ${result.shipType}!`
    } else {
      message = 'Hit!'
    }
  } else {
    message = 'Miss!'
  }

  const allSunk = areAllShipsSunk(gameState.aiShips)
  if (allSunk) {
    gameState.gameStatus = 'won'
    message = 'Congratulations! You won!'
  } else {
    gameState.currentTurn = 'ai'
  }

  return {
    success: true,
    hit: result.hit,
    sunk: result.sunk,
    gameOver: allSunk,
    message,
  }
}

export function processAIAttack(gameState: GameState, coordinates: Coordinates): {
  hit: boolean
  sunk: boolean
  gameOver: boolean
  message: string
} {
  const result = attackCell(
    gameState.playerBoard,
    gameState.playerShips,
    coordinates.row,
    coordinates.col
  )

  let message = ''
  if (result.hit) {
    if (result.sunk) {
      message = `AI sunk your ${result.shipType}!`
    } else {
      message = 'AI hit your ship!'
    }
  } else {
    message = 'AI missed!'
  }

  const allSunk = areAllShipsSunk(gameState.playerShips)
  if (allSunk) {
    gameState.gameStatus = 'lost'
    message = 'Game Over! AI won!'
  } else {
    gameState.currentTurn = 'player'
  }

  return {
    hit: result.hit,
    sunk: result.sunk,
    gameOver: allSunk,
    message,
  }
}
