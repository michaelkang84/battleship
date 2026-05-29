<template>
  <div class="relative min-h-screen overflow-hidden bg-gradient-ocean">
    <WaveBackground :height="180" />

    <div class="relative z-10 mx-auto max-w-3xl p-8">
      <RouterLink
        to="/"
        class="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        ← Back to Home
      </RouterLink>

      <div class="animate-slide-up">
        <h1 class="mb-2 text-4xl font-black text-gradient">How to Play</h1>
        <p class="mb-8 text-muted-foreground">Learn the basics of naval warfare! ⚓</p>
      </div>

      <div class="space-y-6">
        <Card class="animate-slide-up" style="animation-delay: 0.1s; opacity: 0">
          <template #header>
            <h2 class="flex items-center gap-2 text-xl font-bold"><span>🎯</span> Objective</h2>
          </template>
          <p class="text-muted-foreground">
            Sink all of your opponent's ships before they sink yours. The first player to destroy
            the entire enemy fleet wins!
          </p>
        </Card>

        <Card class="animate-slide-up" style="animation-delay: 0.2s; opacity: 0">
          <template #header>
            <h2 class="flex items-center gap-2 text-xl font-bold">
              <span>🚀</span> Getting Started
            </h2>
          </template>
          <ol class="list-inside list-decimal space-y-3 text-muted-foreground">
            <li>
              <strong class="text-foreground">Choose Difficulty</strong> — Select how smart the AI
              opponent will be
            </li>
            <li>
              <strong class="text-foreground">Place Your Ships</strong> — Position your fleet on the
              grid. Use the rotate button or press R to change orientation
            </li>
            <li>
              <strong class="text-foreground">Battle!</strong> — Take turns firing at the enemy
              grid. Click a cell to attack
            </li>
          </ol>
        </Card>

        <Card class="animate-slide-up" style="animation-delay: 0.3s; opacity: 0">
          <template #header>
            <h2 class="flex items-center gap-2 text-xl font-bold"><span>🚢</span> Your Fleet</h2>
          </template>
          <div class="space-y-3">
            <div v-for="(config, type) in SHIP_TYPES" :key="type" class="flex items-center gap-3">
              <div class="flex gap-0.5">
                <div v-for="i in config.length" :key="i" class="h-5 w-5 rounded-sm bg-primary/40" />
              </div>
              <span class="font-semibold">{{ config.name }}</span>
              <span class="text-sm text-muted-foreground">({{ config.length }} cells)</span>
            </div>
          </div>
        </Card>

        <Card class="animate-slide-up" style="animation-delay: 0.4s; opacity: 0">
          <template #header>
            <h2 class="flex items-center gap-2 text-xl font-bold"><span>🎮</span> Controls</h2>
          </template>
          <div class="space-y-2 text-muted-foreground">
            <div class="flex items-start gap-2">
              <Badge>Split View</Badge>
              <span>See both boards side by side</span>
            </div>
            <div class="flex items-start gap-2">
              <Badge>Focus Mode</Badge>
              <span>Minimize status and zoom into the enemy board</span>
            </div>
            <div class="flex items-start gap-2">
              <Badge>Rotate</Badge>
              <span>Rotate the board for a different perspective</span>
            </div>
            <div class="flex items-start gap-2">
              <Badge>Status Panel</Badge>
              <span>Switch between default and minimized views, or open detailed stats in a popup</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { SHIP_TYPES } from '@/constants/game'
import Card from '@/components/ui/Card.vue'
import Badge from '@/components/ui/Badge.vue'
import WaveBackground from '@/components/common/WaveBackground.vue'
</script>
