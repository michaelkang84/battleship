<template>
  <span :class="badgeClasses">
    <slot />
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/utils/cn'

interface Props {
  variant?: 'default' | 'secondary' | 'success' | 'destructive' | 'outline' | 'accent'
  size?: 'sm' | 'md'
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'md',
  class: '',
})

const variantClasses: Record<string, string> = {
  default: 'bg-primary/15 text-primary border-primary/20',
  secondary: 'bg-secondary/15 text-secondary border-secondary/20',
  success: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  destructive: 'bg-destructive/15 text-destructive border-destructive/20',
  outline: 'bg-transparent text-foreground border-border',
  accent: 'bg-accent/15 text-accent border-accent/20',
}

const sizeClasses: Record<string, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-xs',
}

const badgeClasses = computed(() =>
  cn(
    'inline-flex items-center rounded-full border font-semibold transition-colors',
    variantClasses[props.variant],
    sizeClasses[props.size],
    props.class
  )
)
</script>
