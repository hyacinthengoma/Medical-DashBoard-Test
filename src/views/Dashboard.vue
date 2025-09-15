<script setup lang="ts">
import { h, onMounted, onUnmounted } from 'vue';
import { createColumnHelper } from '@tanstack/vue-table';
import { usePatientsStore } from '@/stores/patientsStore';
import { useVitalsAlert } from '@/composables/useVitalsAlert';
import DataTable from '@/components/DataTable.vue';
import StatusBadge from '@/components/patients/StatusBadge.vue';
import { checkPatientStatus } from '@/utils/vitalsUtils';
import { useVitalsSimulation } from '@/composables/useVitalsSimulation';
import { useRouter } from 'vue-router';
import Caption from '@/components/patients/Caption.vue'

const patientsStore = usePatientsStore();
const { alerts, checkAllPatients } = useVitalsAlert();
const router = useRouter();

const columnHelper = createColumnHelper();
const columns = [
  columnHelper.accessor(row => checkPatientStatus(row), {
    id: 'status',
    header: 'Status global',
    cell: info => h(StatusBadge, {
      patient: info.row.original,
      value: info.getValue(),
      type: 'status'
    }),
  }),
  columnHelper.accessor('medicalRecordNumber', { header: 'Numéro médical' }),
  columnHelper.accessor('firstName', { header: 'Prénom' }),
  columnHelper.accessor('lastName', { header: 'Nom' }),
  columnHelper.accessor('age', { header: 'Âge' }),
  columnHelper.accessor(row => Math.round(row.vitals.heartRate.slice(-1)[0]), {
    id: 'lastHeartRate',
    header: 'Dernier HeartRate',
    cell: info => h(StatusBadge, { patient: info.row.original, value: info.getValue(), type: 'hr' }),
  }),
  columnHelper.accessor(row => row.vitals.temperature.slice(-1)[0].toFixed(1), {
    id: 'lastTemperature',
    header: 'Dernière Température',
    cell: info => h(StatusBadge, { patient: info.row.original, value: info.getValue(), type: 'temp' }),
  }),
  columnHelper.accessor(row => {
    const lastBP = row.vitals.bloodPressure.slice(-1)[0];
    return `${lastBP.systolic}/${lastBP.diastolic}`;
  }, {
    id: 'lastBloodPressure',
    header: 'Dernière Tension',
    cell: info => h(StatusBadge, { patient: info.row.original, value: info.getValue(), type: 'bp' }),
  }),
];

let interval: number;
function handleRowClick(patient) {
  router.push({ name: 'PatientDetails', params: { id: patient.id } });
}

useVitalsSimulation();

onUnmounted(() => clearInterval(interval));

</script>

<template>
  <div class="p-6 space-y-6 relative">
    <h1 class="text-3xl font-bold mb-6">Dashboard des patients</h1>
  <Caption />
    <DataTable
      :data="patientsStore.filteredPatients"
      :columns="columns"
      :initialPageSize="10"
      :pageSizeOptions="[5,10,20,50]"
      placeholder="Rechercher un patient..."
      @row-click="handleRowClick"
    />
  </div>
</template>
