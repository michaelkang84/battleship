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
