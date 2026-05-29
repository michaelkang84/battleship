<template>
  <div class="flex min-h-screen items-center justify-center">
    <div class="text-center">
      <h1 class="mb-8 text-6xl font-bold">Battleship</h1>
      <div class="flex flex-col gap-4">
        <RouterLink
          to="/game"
          class="rounded-lg bg-primary px-8 py-3 text-lg font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Start Game
        </RouterLink>
        <RouterLink
          to="/instructions"
          class="rounded-lg border border-border px-8 py-3 text-lg font-semibold transition-colors hover:bg-accent"
        >
          How to Play
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>
