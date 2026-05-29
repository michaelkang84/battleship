<template>
  <div class="container mx-auto max-w-3xl p-8">
    <div class="mb-8 flex items-center justify-between">
      <h1 class="text-4xl font-bold">How to Play</h1>
      <RouterLink
        to="/"
        class="rounded-lg border border-border px-4 py-2 transition-colors hover:bg-accent"
      >
        Back to Home
      </RouterLink>
    </div>
    <div class="space-y-6">
      <section>
        <h2 class="mb-3 text-2xl font-semibold">Objective</h2>
        <p class="text-muted-foreground">
          Sink all of your opponent's ships before they sink yours.
        </p>
      </section>
      <section>
        <h2 class="mb-3 text-2xl font-semibold">Game Rules</h2>
        <ul class="list-inside list-disc space-y-2 text-muted-foreground">
          <li>Each player has a fleet of ships placed on a grid</li>
          <li>Take turns firing at coordinates on the opponent's grid</li>
          <li>Hit all parts of a ship to sink it</li>
          <li>First player to sink all enemy ships wins</li>
        </ul>
      </section>
      <section>
        <h2 class="mb-3 text-2xl font-semibold">Ships</h2>
        <p class="text-muted-foreground">Details about ship types will be added here.</p>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>
