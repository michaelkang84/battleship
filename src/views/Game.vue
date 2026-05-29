<template>
  <div class="container mx-auto p-8">
    <div class="mb-8 flex items-center justify-between">
      <h1 class="text-4xl font-bold">Battleship Game</h1>
      <RouterLink
        to="/"
        class="rounded-lg border border-border px-4 py-2 transition-colors hover:bg-accent"
      >
        Back to Home
      </RouterLink>
    </div>
    <div class="text-center text-muted-foreground">
      <p>Game board will be implemented here</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>
