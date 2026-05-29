import { CELL_STATE, SHIP_TYPES } from '@/constants/game'

export type CellState = (typeof CELL_STATE)[keyof typeof CELL_STATE]

export type ShipType = keyof typeof SHIP_TYPES

export type Difficulty = 'easy' | 'medium' | 'hard'

export type GamePhase = 'options' | 'placement' | 'countdown' | 'battle' | 'gameOver'

export type ViewMode = 'split' | 'player' | 'opponent'

export type StatusMode = 'default' | 'detailed' | 'minimized'

export type Orientation = 'horizontal' | 'vertical'

export type PowerType = 'sonar' | 'airstrike' | 'salvo'

// Intel revealed on enemy cells by Special Ordnance powers.
// 'contact'/'clear' come from a Sonar Ping area scan (no exact location),
// 'ship'/'empty' come from an Airstrike Recon line scan (exact).
export type CellIntel = 'contact' | 'clear' | 'ship' | 'empty'

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
  intel?: CellIntel
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

export interface GameMove {
  player: 'player' | 'opponent'
  coordinates: Coordinates
  result: 'hit' | 'miss'
  shipType?: string
  sunk: boolean
  timestamp: number
}

export interface ShipSunkNotification {
  id: number
  by: 'player' | 'opponent'
  shipType: string
}

export interface DifficultyConfig {
  name: string
  description: string
  icon: string
}

export interface PowerConfig {
  id: PowerType
  ship: ShipType
  name: string
  icon: string
  description: string
}

export interface GameRecord {
  id: string
  date: number
  result: 'victory' | 'defeat'
  difficulty: Difficulty
  totalMoves: number
  playerShipsRemaining: number
  opponentShipsRemaining: number
}
