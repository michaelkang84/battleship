import type { Board, Coordinates } from '@/game/types'
import { BOARD_SIZE, CELL_STATE } from '@/constants/game'

let huntStack: Coordinates[] = []

export function getAIMove(board: Board): Coordinates {
  if (huntStack.length > 0) {
    const target = huntStack.pop()!
    if (
      target.row >= 0 &&
      target.row < BOARD_SIZE &&
      target.col >= 0 &&
      target.col < BOARD_SIZE &&
      board[target.row][target.col].state !== CELL_STATE.HIT &&
      board[target.row][target.col].state !== CELL_STATE.MISS
    ) {
      return target
    }
  }

  let row: number
  let col: number
  let attempts = 0

  do {
    row = Math.floor(Math.random() * BOARD_SIZE)
    col = Math.floor(Math.random() * BOARD_SIZE)
    attempts++
  } while (
    (board[row][col].state === CELL_STATE.HIT || board[row][col].state === CELL_STATE.MISS) &&
    attempts < 200
  )

  return { row, col }
}

export function updateAIState(hit: boolean, sunk: boolean, coordinates: Coordinates): void {
  if (hit && !sunk) {
    const { row, col } = coordinates
    huntStack.push(
      { row: row - 1, col },
      { row: row + 1, col },
      { row, col: col - 1 },
      { row, col: col + 1 }
    )
  }
  if (sunk) {
    huntStack = []
  }
}

export function resetAI(): void {
  huntStack = []
}
