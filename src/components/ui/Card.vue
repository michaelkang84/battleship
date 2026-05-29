<template>
  <div :class="cardClasses">
    <div v-if="$slots.header" class="border-b border-border/50 px-6 py-4">
      <slot name="header" />
    </div>
    <div :class="cn('px-6 py-4', contentClass)">
      <slot />
    </div>
    <div v-if="$slots.footer" class="border-t border-border/50 px-6 py-4">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/utils/cn'

interface Props {
  variant?: 'default' | 'glass' | 'outlined' | 'elevated'
  class?: string
  contentClass?: string
  hoverable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  class: '',
  contentClass: '',
  hoverable: false,
})

const variantClasses: Record<string, string> = {
  default: 'bg-card text-card-foreground border border-border/50 shadow-sm',
  glass: 'glass text-foreground',
  outlined: 'border-2 border-border bg-transparent text-foreground',
  elevated: 'bg-card text-card-foreground shadow-lg border border-border/30',
}

const cardClasses = computed(() =>
  cn(
    'rounded-xl transition-all duration-200',
    variantClasses[props.variant],
    props.hoverable && 'hover:shadow-md hover:-translate-y-0.5 cursor-pointer',
    props.class
  )
)
</script>
