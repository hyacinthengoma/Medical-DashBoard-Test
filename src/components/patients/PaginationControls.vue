<template>
  <div class="flex items-center justify-between">
    <div class="text-sm text-gray-600">Affichage {{ startItem + 1 }} - {{ Math.min(endItem, totalItems) }} sur {{ totalItems }}</div>
    <div class="flex items-center gap-2">
      <button @click="prevPage" :disabled="page === 1" class="px-3 py-1 border rounded">Préc</button>
      <div class="px-3">Page {{ page }} / {{ totalPages }}</div>
      <button @click="nextPage" :disabled="page === totalPages" class="px-3 py-1 border rounded">Suiv</button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps(['page', 'totalPages', 'startItem', 'endItem', 'totalItems', 'prevPage', 'nextPage']);
</script>
