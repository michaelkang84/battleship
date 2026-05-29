import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { GameRecord } from '@/game/types'

const STORAGE_KEY = 'battleship-history'

function loadHistory(): GameRecord[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function saveHistory(records: GameRecord[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records))
}

export const useHistoryStore = defineStore('history', () => {
  const records = ref<GameRecord[]>(loadHistory())

  const totalGames = computed(() => records.value.length)
  const victories = computed(() => records.value.filter(r => r.result === 'victory').length)
  const defeats = computed(() => records.value.filter(r => r.result === 'defeat').length)

  function addRecord(record: Omit<GameRecord, 'id' | 'date'>) {
    const newRecord: GameRecord = {
      ...record,
      id: crypto.randomUUID(),
      date: Date.now(),
    }
    records.value.unshift(newRecord)
    saveHistory(records.value)
  }

  function clearHistory() {
    records.value = []
    saveHistory(records.value)
  }

  return {
    records,
    totalGames,
    victories,
    defeats,
    addRecord,
    clearHistory,
  }
})
