<template>
  <button :class="buttonClasses" :disabled="disabled" v-bind="$attrs">
    <span v-if="$slots.icon" class="mr-2">
      <slot name="icon" />
    </span>
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/utils/cn'

interface Props {
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'accent'
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'icon'
  disabled?: boolean
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'md',
  disabled: false,
  class: '',
})

const variantClasses: Record<string, string> = {
  default: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-lg',
  secondary:
    'bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-md hover:shadow-lg',
  outline:
    'border-2 border-primary/30 bg-transparent text-foreground hover:bg-primary/10 hover:border-primary/50',
  ghost: 'bg-transparent text-foreground hover:bg-muted',
  destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-md',
  accent: 'bg-accent text-accent-foreground hover:bg-accent/90 shadow-md hover:shadow-lg',
}

const sizeClasses: Record<string, string> = {
  sm: 'px-3 py-1.5 text-sm rounded-md',
  md: 'px-5 py-2.5 text-sm rounded-lg',
  lg: 'px-7 py-3 text-base rounded-lg',
  xl: 'px-9 py-4 text-lg rounded-xl',
  icon: 'h-10 w-10 rounded-lg',
}

const buttonClasses = computed(() =>
  cn(
    'inline-flex items-center justify-center font-semibold transition-all duration-200',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50',
    'active:scale-[0.97]',
    variantClasses[props.variant],
    sizeClasses[props.size],
    props.class
  )
)
</script>
