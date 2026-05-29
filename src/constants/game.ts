import type { DifficultyConfig, PowerConfig, PowerType } from '@/game/types'

export const BOARD_SIZE = 10

export const SHIP_TYPES = {
  CARRIER: { name: 'Carrier', length: 5 },
  BATTLESHIP: { name: 'Battleship', length: 4 },
  CRUISER: { name: 'Cruiser', length: 3 },
  SUBMARINE: { name: 'Submarine', length: 3 },
  DESTROYER: { name: 'Destroyer', length: 2 },
} as const

export const CELL_STATE = {
  EMPTY: 'empty',
  SHIP: 'ship',
  HIT: 'hit',
  MISS: 'miss',
} as const

export const DIFFICULTY_LEVELS: Record<string, DifficultyConfig> = {
  easy: {
    name: 'Easy',
    description: 'AI fires randomly. Great for learning!',
    icon: '🌊',
  },
  medium: {
    name: 'Medium',
    description: 'AI hunts near successful hits.',
    icon: '⚓',
  },
  hard: {
    name: 'Hard',
    description: 'AI uses advanced targeting strategy.',
    icon: '🔥',
  },
}

// Special Ordnance: optional, off-by-default per-ship powers. Each can be used
// once per game and keeps classic Battleship rules intact ("a hit is still a hit").
export const SPECIAL_POWERS: Record<PowerType, PowerConfig> = {
  sonar: {
    id: 'sonar',
    ship: 'SUBMARINE',
    name: 'Sonar Ping',
    icon: '📡',
    description: 'Scan a 3×3 sector for any enemy ship (no exact location). Uses your turn.',
  },
  airstrike: {
    id: 'airstrike',
    ship: 'CARRIER',
    name: 'Airstrike Recon',
    icon: '✈️',
    description: 'Reveal ship / empty for a 1×3 line. Intel only — no damage. Uses your turn.',
  },
  salvo: {
    id: 'salvo',
    ship: 'BATTLESHIP',
    name: 'Salvo',
    icon: '🎯',
    description: 'Fire two shots in a single turn.',
  },
}

export const ROW_LABELS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
export const COL_LABELS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']
