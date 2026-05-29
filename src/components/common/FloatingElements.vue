<template>
  <div class="pointer-events-none absolute inset-0 overflow-hidden">
    <div
      v-for="bubble in bubbles"
      :key="bubble.id"
      class="absolute rounded-full"
      :style="{
        left: bubble.x + '%',
        bottom: '-20px',
        width: bubble.size + 'px',
        height: bubble.size + 'px',
        background: `radial-gradient(circle at 30% 30%, ${bubble.color}40, ${bubble.color}10)`,
        border: `1px solid ${bubble.color}20`,
        animation: `bubble-rise ${bubble.duration}s ease-in ${bubble.delay}s infinite`,
      }"
    />
    <div
      v-for="element in floatingIcons"
      :key="element.id"
      class="absolute text-2xl opacity-20"
      :style="{
        left: element.x + '%',
        top: element.y + '%',
        animation: `float ${element.duration}s ease-in-out ${element.delay}s infinite`,
      }"
    >
      {{ element.icon }}
    </div>
  </div>
</template>

<script setup lang="ts">
interface BubbleConfig {
  id: number
  x: number
  size: number
  color: string
  duration: number
  delay: number
}

interface FloatingIcon {
  id: number
  x: number
  y: number
  icon: string
  duration: number
  delay: number
}

interface Props {
  bubbleCount?: number
  showIcons?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  bubbleCount: 8,
  showIcons: true,
})

const colors = ['#6366f1', '#2dd4bf', '#f97316', '#3b82f6', '#a855f7']
const icons = ['⚓', '🚢', '🌊', '⭐', '🐚', '🐠', '🧭']

const bubbles: BubbleConfig[] = Array.from({ length: props.bubbleCount }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  size: 10 + Math.random() * 30,
  color: colors[i % colors.length],
  duration: 6 + Math.random() * 8,
  delay: Math.random() * 5,
}))

const floatingIcons: FloatingIcon[] = props.showIcons
  ? Array.from({ length: 5 }, (_, i) => ({
      id: i + 100,
      x: 10 + i * 20,
      y: 15 + Math.random() * 60,
      icon: icons[i % icons.length],
      duration: 4 + Math.random() * 4,
      delay: Math.random() * 3,
    }))
  : []
</script>
