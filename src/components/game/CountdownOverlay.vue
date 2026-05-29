<template>
  <Transition name="fade">
    <div
      v-if="isVisible"
      class="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm"
    >
      <!-- Ripple effect -->
      <div v-if="currentStep !== 'done'" class="absolute">
        <div
          :key="'ripple-' + currentStep"
          class="h-32 w-32 animate-ripple rounded-full border-2 border-primary/30"
        />
      </div>

      <!-- Countdown number -->
      <Transition name="pop" mode="out-in">
        <div v-if="currentStep === 3" key="3" class="text-center">
          <div class="animate-countdown-pop text-9xl font-black text-primary">3</div>
        </div>
        <div v-else-if="currentStep === 2" key="2" class="text-center">
          <div class="animate-countdown-pop text-9xl font-black text-secondary">2</div>
        </div>
        <div v-else-if="currentStep === 1" key="1" class="text-center">
          <div class="animate-countdown-pop text-9xl font-black text-accent">1</div>
        </div>
        <div v-else-if="currentStep === 'battle'" key="battle" class="text-center">
          <div class="animate-countdown-pop text-7xl font-black text-gradient">BATTLE!</div>
          <div
            class="mt-2 animate-slide-up text-xl text-muted-foreground"
            style="animation-delay: 0.3s; opacity: 0"
          >
            ⚔️
          </div>
        </div>
        <div v-else-if="currentStep === 'ready'" key="ready" class="text-center">
          <div class="animate-slide-up text-3xl font-bold text-foreground">
            Make your first move, Captain! 🎯
          </div>
          <div
            class="mt-3 animate-slide-up text-lg text-muted-foreground"
            style="animation-delay: 0.2s; opacity: 0"
          >
            Click on the enemy waters to fire
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const emit = defineEmits<{
  complete: []
}>()

const isVisible = ref(true)
const currentStep = ref<number | 'battle' | 'ready' | 'done'>(3)

onMounted(async () => {
  await delay(900)
  currentStep.value = 2
  await delay(900)
  currentStep.value = 1
  await delay(900)
  currentStep.value = 'battle'
  await delay(1200)
  currentStep.value = 'ready'
  await delay(2000)
  isVisible.value = false
  await delay(300)
  emit('complete')
})

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}
</script>

<style scoped>
.pop-enter-active {
  transition: all 0.3s ease-out;
}

.pop-leave-active {
  transition: all 0.2s ease-in;
}

.pop-enter-from {
  opacity: 0;
  transform: scale(0.5);
}

.pop-leave-to {
  opacity: 0;
  transform: scale(1.3);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
