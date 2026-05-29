import type { Board, Ship, ShipType } from '@/game/types'
import { BOARD_SIZE, CELL_STATE, SHIP_TYPES } from '@/constants/game'

export function createEmptyBoard(): Board {
  return Array.from({ length: BOARD_SIZE }, () =>
    Array.from({ length: BOARD_SIZE }, () => ({
      state: CELL_STATE.EMPTY as 'empty',
      hasShip: false,
    }))
  )
}

export function placeShipsRandomly(board: Board): Ship[] {
  const ships: Ship[] = []
  const types = Object.keys(SHIP_TYPES) as ShipType[]

  for (const type of types) {
    const config = SHIP_TYPES[type]
    let placed = false
    let attempts = 0

    while (!placed && attempts < 200) {
      const horizontal = Math.random() < 0.5
      const maxRow = horizontal ? BOARD_SIZE : BOARD_SIZE - config.length
      const maxCol = horizontal ? BOARD_SIZE - config.length : BOARD_SIZE
      const row = Math.floor(Math.random() * maxRow)
      const col = Math.floor(Math.random() * maxCol)

      const coords = []
      let valid = true

      for (let i = 0; i < config.length; i++) {
        const r = horizontal ? row : row + i
        const c = horizontal ? col + i : col
        if (board[r][c].hasShip) {
          valid = false
          break
        }
        coords.push({ row: r, col: c })
      }

      if (valid) {
        coords.forEach(({ row: r, col: c }) => {
          board[r][c].hasShip = true
          board[r][c].shipId = type
        })
        ships.push({
          type,
          length: config.length,
          coordinates: coords,
          hits: 0,
          isSunk: false,
        })
        placed = true
      }
      attempts++
    }
  }

  return ships
}

export function attackCell(
  board: Board,
  ships: Ship[],
  row: number,
  col: number
): {
  hit: boolean
  sunk: boolean
  shipType?: string
} {
  const cell = board[row][col]

  if (cell.state === CELL_STATE.HIT || cell.state === CELL_STATE.MISS) {
    return { hit: false, sunk: false }
  }

  if (cell.hasShip) {
    cell.state = CELL_STATE.HIT
    const ship = ships.find(s => s.type === cell.shipId)
    if (ship) {
      ship.hits++
      if (ship.hits >= ship.length) {
        ship.isSunk = true
        return { hit: true, sunk: true, shipType: SHIP_TYPES[ship.type].name }
      }
    }
    return { hit: true, sunk: false, shipType: cell.shipId }
  }

  cell.state = CELL_STATE.MISS
  return { hit: false, sunk: false }
}

export function areAllShipsSunk(ships: Ship[]): boolean {
  return ships.length > 0 && ships.every(ship => ship.isSunk)
}
