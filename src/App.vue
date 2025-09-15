<script setup lang="ts">
import {RouterView } from 'vue-router'
import Default from '@/layout/Default.vue'
import '@/assets/main.css'
import Toast from '@/components/patients/Toast.vue'
</script>

<template>
  <Default>
    <RouterView />
    <Toast />
  </Default>

</template>

<style scoped></style>
