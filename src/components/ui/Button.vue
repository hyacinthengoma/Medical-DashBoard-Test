<template>
  <button :class="classes" @click="$emit('click')">
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { type PropType } from 'vue';

const props = defineProps({
  variant: { type: String as PropType<'primary' | 'secondary'>, default: 'primary' }
});

const classes = computed(() => {
  return props.variant === 'primary'
    ? 'px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
    : 'px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400';
});
</script>
