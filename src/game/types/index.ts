import { CELL_STATE, SHIP_TYPES } from '@/constants/game'

export type CellState = (typeof CELL_STATE)[keyof typeof CELL_STATE]

export type ShipType = keyof typeof SHIP_TYPES

export interface Coordinates {
  row: number
  col: number
}

export interface Ship {
  type: ShipType
  length: number
  coordinates: Coordinates[]
  hits: number
  isSunk: boolean
}

export interface Cell {
  state: CellState
  hasShip: boolean
  shipId?: string
}

export type Board = Cell[][]

export interface Player {
  board: Board
  ships: Ship[]
}

export interface GameState {
  playerBoard: Board
  aiBoard: Board
  playerShips: Ship[]
  aiShips: Ship[]
  currentTurn: 'player' | 'ai'
  gameStatus: 'setup' | 'playing' | 'won' | 'lost'
}
