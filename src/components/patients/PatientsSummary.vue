<template>
  <div class="flex gap-3 flex-wrap">
    <div class="px-4 py-2 rounded-md bg-green-50 text-green-800 font-semibold">Stable: {{ counts.normal }}</div>
    <div class="px-4 py-2 rounded-md bg-yellow-50 text-yellow-800 font-semibold">Watch: {{ counts.watch }}</div>
    <div class="px-4 py-2 rounded-md bg-red-50 text-red-800 font-semibold">Critique: {{ counts.critical }}</div>
    <div class="px-4 py-2 rounded-md bg-blue-50 text-blue-800 font-semibold">Total: {{ total }}</div>
  </div>
</template>

<script setup lang="ts">
defineProps(['counts', 'total']);
</script>
