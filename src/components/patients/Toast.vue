<script setup lang="ts">
import { ref } from 'vue';
import { useVitalsAlert } from '@/composables/useVitalsAlert';
import { usePatientsStore } from '@/stores/patientsStore';
import { useRouter } from 'vue-router';

const showAlerts = ref(false);
const { alerts } = useVitalsAlert();
const patientsStore = usePatientsStore();
const router = useRouter();

const getPatientName = (id: number) => {
  const patient = patientsStore.getPatientById(id);
  return patient ? `${patient.firstName} ${patient.lastName}` : 'Inconnu';
};

const viewDetails = (id: number) => {
  showAlerts.value = false;
  router.push({ name: 'PatientDetails', params: { id } });
};
</script>

<template>
  <button
    v-if="alerts.length"
    class="fixed top-4 right-6 bg-red-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 z-50"
    @click="showAlerts = !showAlerts"
  >⚠️
    <span class="bg-white text-red-600 font-bold px-2 py-0.5 rounded-full">
      {{ alerts.length }}
    </span>
  </button>

  <!-- 📋 Panneau latéral alertes -->
  <div
    v-if="showAlerts"
    class="fixed top-0 right-0 h-full w-96 bg-white shadow-2xl border-l p-4 z-50 overflow-y-auto flex flex-col"
  >
    <!-- 🔘 Header panneau -->
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-bold">🚨 Alertes Patients</h2>
      <button
        class="cursor-pointer text-gray-600 hover:text-red-600 text-2xl font-bold"
        @click="showAlerts = false"
      >
        ✖
      </button>
    </div>

    <!-- 📌 Liste des alertes -->
    <div
      v-for="alert in alerts"
      :key="alert.patientId"
      class="p-3 mb-2 rounded-lg bg-red-50 shadow-sm flex justify-between items-center"
    >
      <div>
        <p class="font-semibold text-red-600">{{ alert.status.toUpperCase() }}</p>
        <p class="text-gray-700">Patient: {{ getPatientName(alert.patientId) }}</p>
      </div>
      <button
        @click="viewDetails(alert.patientId)"
        class="cursor-pointer text-blue-600 underline hover:text-blue-800"
      >
        Voir
      </button>
    </div>
  </div>
</template>
