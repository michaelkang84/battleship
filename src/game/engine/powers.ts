import type { Coordinates } from '@/game/types'
import { BOARD_SIZE } from '@/constants/game'

function inBounds(row: number, col: number): boolean {
  return row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE
}

// 3×3 sector centered on the anchor, clamped to the board edges.
export function getSonarArea(anchor: Coordinates): Coordinates[] {
  const cells: Coordinates[] = []
  for (let row = anchor.row - 1; row <= anchor.row + 1; row++) {
    for (let col = anchor.col - 1; col <= anchor.col + 1; col++) {
      if (inBounds(row, col)) cells.push({ row, col })
    }
  }
  return cells
}

// Horizontal 1×3 line centered on the anchor, clamped to the board edges.
export function getAirstrikeArea(anchor: Coordinates): Coordinates[] {
  const cells: Coordinates[] = []
  for (let col = anchor.col - 1; col <= anchor.col + 1; col++) {
    if (inBounds(anchor.row, col)) cells.push({ row: anchor.row, col })
  }
  return cells
}
