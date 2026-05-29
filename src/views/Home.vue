<template>
  <div
    class="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-ocean"
  >
    <FloatingElements :bubble-count="10" />
    <WaveBackground :height="250" />

    <div class="relative z-10 text-center">
      <!-- Animated Title -->
      <div class="mb-2 flex items-center justify-center gap-1">
        <span
          v-for="(letter, index) in titleLetters"
          :key="index"
          class="inline-block animate-title-letter text-6xl font-black tracking-tight md:text-8xl"
          :class="letter === ' ' ? 'w-4' : 'text-gradient'"
          :style="{ animationDelay: index * 0.07 + 's', opacity: 0 }"
        >
          {{ letter === ' ' ? '' : letter }}
        </span>
      </div>

      <!-- Subtitle -->
      <p
        class="animate-slide-up mb-10 text-lg font-medium text-muted-foreground md:text-xl"
        style="animation-delay: 0.8s; opacity: 0"
      >
        Command your fleet. Sink the enemy. 🚢
      </p>

      <!-- Action buttons -->
      <div class="flex flex-col items-center gap-4" style="animation-delay: 1s">
        <RouterLink to="/game" class="group">
          <Button
            size="xl"
            class="animate-slide-up relative overflow-hidden"
            style="animation-delay: 1s; opacity: 0"
          >
            <span class="relative z-10 flex items-center gap-2">
              <span>Start New Game</span>
              <span class="inline-block transition-transform duration-300 group-hover:translate-x-1"
                >→</span
              >
            </span>
          </Button>
        </RouterLink>

        <div class="flex gap-3">
          <RouterLink to="/instructions">
            <Button
              variant="outline"
              size="lg"
              class="animate-slide-up"
              style="animation-delay: 1.15s; opacity: 0"
            >
              How to Play
            </Button>
          </RouterLink>

          <RouterLink to="/history">
            <Button
              variant="ghost"
              size="lg"
              class="animate-slide-up"
              style="animation-delay: 1.25s; opacity: 0"
            >
              Game History
            </Button>
          </RouterLink>
        </div>
      </div>

      <!-- Ship display -->
      <div
        class="animate-fade-in mt-16 flex items-center justify-center gap-3"
        style="animation-delay: 1.4s; opacity: 0"
      >
        <div
          v-for="(config, type) in SHIP_TYPES"
          :key="type"
          class="group flex flex-col items-center gap-1"
        >
          <div class="flex gap-0.5">
            <div
              v-for="i in config.length"
              :key="i"
              class="h-3 w-3 rounded-[2px] bg-primary/30 transition-colors group-hover:bg-primary/60"
            />
          </div>
          <span class="text-[10px] font-medium text-muted-foreground/60">{{ config.name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { SHIP_TYPES } from '@/constants/game'
import Button from '@/components/ui/Button.vue'
import FloatingElements from '@/components/common/FloatingElements.vue'
import WaveBackground from '@/components/common/WaveBackground.vue'

const titleLetters = 'BATTLESHIP'.split('')
</script>
