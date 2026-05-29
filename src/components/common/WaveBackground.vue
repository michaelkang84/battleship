<template>
  <div class="pointer-events-none absolute inset-0 overflow-hidden">
    <svg
      class="wave-container"
      viewBox="0 0 1440 320"
      preserveAspectRatio="none"
      :style="{ height: height + 'px' }"
    >
      <path
        class="wave-path"
        :fill="wave1Color"
        fill-opacity="0.15"
        d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,170.7C960,160,1056,192,1152,197.3C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
      />
      <path
        class="wave-path-slow"
        :fill="wave2Color"
        fill-opacity="0.1"
        d="M0,256L48,240C96,224,192,192,288,181.3C384,171,480,181,576,202.7C672,224,768,256,864,261.3C960,267,1056,245,1152,224C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
      />
      <path
        class="wave-path"
        :fill="wave3Color"
        fill-opacity="0.08"
        style="animation-delay: -3s"
        d="M0,288L48,272C96,256,192,224,288,213.3C384,203,480,213,576,229.3C672,245,768,267,864,272C960,277,1056,267,1152,245.3C1248,224,1344,192,1392,176L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
      />
    </svg>
  </div>
</template>

<script setup lang="ts">
interface Props {
  height?: number
  wave1Color?: string
  wave2Color?: string
  wave3Color?: string
}

withDefaults(defineProps<Props>(), {
  height: 200,
  wave1Color: '#0EA5E9',
  wave2Color: '#38BDF8',
  wave3Color: '#0284C7',
})
</script>
