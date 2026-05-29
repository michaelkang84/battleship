<template>
  <div class="min-h-screen bg-gradient-ocean">
    <div class="mx-auto max-w-2xl px-4 py-12">
      <!-- Header -->
      <div class="mb-8">
        <RouterLink
          to="/"
          class="mb-4 inline-block text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          ← Back to Home
        </RouterLink>
        <h1 class="text-3xl font-black text-gradient">Game History</h1>
        <p class="mt-1 text-sm text-muted-foreground">Your past battles at a glance</p>
      </div>

      <!-- Stats bar -->
      <div
        v-if="historyStore.totalGames > 0"
        class="mb-6 flex items-center gap-6 rounded-xl border border-border/50 bg-card p-4 shadow-sm"
      >
        <div class="text-center">
          <div class="text-2xl font-black text-foreground">{{ historyStore.totalGames }}</div>
          <div class="text-xs font-medium text-muted-foreground">Played</div>
        </div>
        <div class="h-8 w-px bg-border/50" />
        <div class="text-center">
          <div class="text-2xl font-black text-primary">{{ historyStore.victories }}</div>
          <div class="text-xs font-medium text-muted-foreground">Wins</div>
        </div>
        <div class="h-8 w-px bg-border/50" />
        <div class="text-center">
          <div class="text-2xl font-black text-destructive">{{ historyStore.defeats }}</div>
          <div class="text-xs font-medium text-muted-foreground">Losses</div>
        </div>
        <div class="flex-1" />
        <Button variant="ghost" size="sm" @click="confirmClear">Clear All</Button>
      </div>

      <!-- Game list -->
      <div v-if="historyStore.totalGames > 0" class="space-y-3">
        <div
          v-for="record in historyStore.records"
          :key="record.id"
          class="flex items-center gap-4 rounded-xl border border-border/50 bg-card px-5 py-4 shadow-sm transition-all duration-200 hover:shadow-md"
        >
          <!-- Result icon -->
          <div class="text-3xl">
            {{ record.result === 'victory' ? '🎉' : '💀' }}
          </div>

          <!-- Details -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2">
              <span
                class="text-sm font-bold"
                :class="record.result === 'victory' ? 'text-primary' : 'text-destructive'"
              >
                {{ record.result === 'victory' ? 'Victory' : 'Defeat' }}
              </span>
              <span class="text-xs text-muted-foreground">·</span>
              <span class="text-xs font-medium text-muted-foreground capitalize">
                {{ record.difficulty }}
              </span>
            </div>
            <div class="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
              <span>{{ record.totalMoves }} moves</span>
              <span>·</span>
              <span>🚢 {{ record.playerShipsRemaining }}/5</span>
              <span>vs</span>
              <span>🏴‍☠️ {{ record.opponentShipsRemaining }}/5</span>
            </div>
          </div>

          <!-- Date -->
          <div class="text-xs text-muted-foreground whitespace-nowrap">
            {{ formatDate(record.date) }}
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div
        v-else
        class="flex flex-col items-center justify-center rounded-xl border border-border/50 bg-card py-16 text-center shadow-sm"
      >
        <div class="mb-3 text-5xl">🗺️</div>
        <h2 class="mb-1 text-lg font-bold text-foreground">No battles yet</h2>
        <p class="mb-6 text-sm text-muted-foreground">Start a game to begin your war log</p>
        <RouterLink to="/game">
          <Button>Start New Game →</Button>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useHistoryStore } from '@/stores/historyStore'
import Button from '@/components/ui/Button.vue'

const historyStore = useHistoryStore()

function formatDate(timestamp: number): string {
  const date = new Date(timestamp)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function confirmClear() {
  if (window.confirm('Clear all game history? This cannot be undone.')) {
    historyStore.clearHistory()
  }
}
</script>
