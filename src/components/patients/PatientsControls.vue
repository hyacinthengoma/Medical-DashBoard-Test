<template>
  <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
    <div class="flex items-center gap-2">
      <input v-model="globalSearch" placeholder="Rechercher (nom, dossier...)" class="px-3 py-2 border rounded-md w-64" />
      <select v-model="selectedStatus" class="px-3 py-2 border rounded-md">
        <option value="all">Tous</option>
        <option value="normal">Stable</option>
        <option value="watch">Watch</option>
        <option value="critical">Critique</option>
      </select>
    </div>
    <div class="flex items-center gap-2">
      <label class="text-sm">Afficher</label>
      <select v-model.number="pageSize" class="px-2 py-2 border rounded-md">
        <option :value="10">10</option>
        <option :value="25">25</option>
        <option :value="50">50</option>
        <option :value="100">100</option>
      </select>
      <button @click="$emit('export')" class="px-3 py-2 rounded-md border bg-white hover:bg-gray-50">Exporter CSV</button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineEmits(['export']);
defineProps(['globalSearch', 'selectedStatus', 'pageSize']);
</script>
