<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div class="bg-white p-6 rounded w-11/12 md:w-2/3 lg:w-1/2 relative">
      <button @click="$emit('close')" class="absolute top-2 right-2 text-gray-600">X</button>
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  isOpen: { type: Boolean, required: true }
});
</script>
