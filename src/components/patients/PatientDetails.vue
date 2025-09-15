<template>
  <div class="p-6 space-y-6">
    <!-- Infos patient -->
    <Card v-if="patient && !isEditing">
      <h2 class="text-xl font-semibold mb-2">
        {{ patient.firstName }} {{ patient.lastName }}
      </h2>
      <p>Âge : {{ patient.age }}</p>
      <p>Numéro dossier médical : {{ patient.medicalRecordNumber }}</p>
    </Card>



    <Card v-else-if="!patient">
      <p class="text-red-500">
        Patient introuvable. Veuillez vérifier l'ID fourni.
      </p>
    </Card>

    <!-- Graphique combiné -->
    <Card v-if="patient && !isEditing">
      <h3 class="text-lg font-medium mb-4">Constantes vitales (24h)</h3>
      <canvas id="vitalsChart"></canvas>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { usePatientsStore } from '@/stores/patientsStore';
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import Card from '@/components/ui/Card.vue';

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend
);

const props = defineProps<{ patientId: number }>();

const patientsStore = usePatientsStore();

const patient = computed(() => {
  if (!props.patientId) return null;
  return patientsStore.getPatientById(props.patientId) ?? null;
});

// --- Édition ---
const isEditing = ref(false);
const editablePatient = ref<any>(null);

function enableEdit() {
  if (patient.value) {
    editablePatient.value = { ...patient.value };
    isEditing.value = true;
  }
}

function cancelEdit() {
  isEditing.value = false;
  editablePatient.value = null;
}

function saveEdit() {
  if (editablePatient.value) {
    patientsStore.updatePatient(editablePatient.value);
    isEditing.value = false;
  }
}

// --- Graphique combiné ---
onMounted(async () => {
  if (!patient.value) return;
  await nextTick();

  const canvas = document.getElementById('vitalsChart') as HTMLCanvasElement | null;
  if (!canvas) return;

  new Chart(canvas, {
    type: 'line',
    data: {
      labels: patient.value.vitals.heartRate.map((_, i) => `T-${i}`),
      datasets: [
        {
          label: 'Fréquence cardiaque (bpm)',
          data: patient.value.vitals.heartRate,
          borderColor: 'red',
          fill: false,
          tension: 0.3,
          pointRadius: 2,
        },
        {
          label: 'Température (°C)',
          data: patient.value.vitals.temperature,
          borderColor: 'orange',
          fill: false,
          tension: 0.3,
          pointRadius: 2,
        },
        {
          label: 'Systolique (mmHg)',
          data: patient.value.vitals.bloodPressure.map(bp => bp.systolic),
          borderColor: 'blue',
          fill: false,
          tension: 0.3,
          pointRadius: 2,
        },
        {
          label: 'Diastolique (mmHg)',
          data: patient.value.vitals.bloodPressure.map(bp => bp.diastolic),
          borderColor: 'green',
          fill: false,
          tension: 0.3,
          pointRadius: 2,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'top' },
        tooltip: { mode: 'index', intersect: false },
        title: { display: true, text: 'Évolution des constantes vitales' },
      },
      interaction: { mode: 'nearest', axis: 'x', intersect: false },
      scales: {
        x: { display: true, title: { display: true, text: 'Mesures' } },
        y: { display: true, title: { display: true, text: 'Valeur' } },
      },
    },
  });
});
</script>

<style scoped>
canvas {
  width: 100%;
  height: 300px;
}
</style>
