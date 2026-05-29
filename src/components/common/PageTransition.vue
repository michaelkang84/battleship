<template>
  <Transition :name="transitionName" mode="out-in">
    <slot />
  </Transition>
</template>

<script setup lang="ts">
interface Props {
  transitionName?: string
}

withDefaults(defineProps<Props>(), {
  transitionName: 'page',
})
</script>

<style scoped>
.page-enter-active {
  transition: all 0.3s ease-out;
}

.page-leave-active {
  transition: all 0.2s ease-in;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(15px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.scale-enter-active {
  transition: all 0.3s ease-out;
}

.scale-leave-active {
  transition: all 0.2s ease-in;
}

.scale-enter-from {
  opacity: 0;
  transform: scale(0.95);
}

.scale-leave-to {
  opacity: 0;
  transform: scale(1.03);
}
</style>
