<template>
  <div class="p-6 space-y-6">
    <!-- ========================
         🧑 Infos patient
    ========================== -->
    <Card
      v-if="patient"
      class="p-4 space-y-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-center gap-4"
    >
      <!-- Avatar + identité -->
      <div class="flex items-center gap-4">
        <div class="flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-700 text-2xl font-bold">
          {{ patient.firstName[0] }}{{ patient.lastName[0] }}
        </div>
        <div>
          <h2 class="text-2xl font-semibold">
            {{ patient.firstName }} {{ patient.lastName }}
          </h2>
          <p class="text-sm text-gray-500">
            Dossier médical #{{ patient.medicalRecordNumber }}
          </p>
        </div>
      </div>

      <!-- Âge -->
      <div class="grid gap-4 text-sm items-center">
        <div>
          <p class="text-gray-500">Âge</p>
          <p class="font-medium">{{ patient.age }} ans</p>
        </div>
      </div>

      <!-- Bouton modification -->
      <div class="justify-self-end">
        <Button variant="secondary" @click="editPatient">✏️ Modifier</Button>
      </div>
    </Card>

    <!-- ========================
         ✏️ Formulaire d’édition
    ========================== -->
    <Card v-if="patient && isEditing" class="p-4">
      <h2 class="text-xl font-semibold mb-4">Modifier le patient</h2>

      <form @submit.prevent="saveEdit" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label for="firstName">Prénom</Label>
            <Input id="firstName" v-model="editablePatient.firstName" />
          </div>
          <div>
            <Label for="lastName">Nom</Label>
            <Input id="lastName" v-model="editablePatient.lastName" />
          </div>
          <div>
            <Label for="age">Âge</Label>
            <Input id="age" type="number" v-model.number="editablePatient.age" />
          </div>
          <div>
            <Label for="medicalRecordNumber">N° dossier médical</Label>
            <Input id="medicalRecordNumber" v-model="editablePatient.medicalRecordNumber" />
          </div>
        </div>

        <!-- Boutons -->
        <div class="flex gap-2 mt-4">
          <Button type="submit">Enregistrer</Button>
          <Button type="button" variant="outline" @click="cancelEdit">Annuler</Button>
        </div>
      </form>
    </Card>

    <!-- ========================
         ⚠️ Patient introuvable
    ========================== -->
    <Card v-else-if="!patient" class="p-4">
      <p class="text-red-500">⚠️ Patient introuvable. Veuillez vérifier l'ID fourni.</p>
    </Card>

    <!-- ========================
         📊 Graphiques
    ========================== -->
    <Card v-if="patient && !isEditing" class="p-4">
      <!-- En-tête -->
      <div class="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-2">
        <h3 class="font-semibold text-lg">Constantes vitales</h3>

        <!-- Boutons toggle -->
        <div class="flex gap-2">
          <Button
            size="sm"
            :variant="showCombined ? 'default' : 'outline'"
            @click="toggleCombined(true)"
          >
            Tout-en-un
          </Button>
          <Button
            size="sm"
            :variant="!showCombined ? 'default' : 'outline'"
            @click="toggleCombined(false)"
          >
            Graphiques séparés
          </Button>
        </div>
      </div>

      <!-- Graphique combiné -->
      <canvas v-if="showCombined" id="vitalsChart"></canvas>

      <!-- Graphiques séparés -->
      <div v-else class="space-y-6">
        <canvas id="hrChart"></canvas>
        <canvas id="tempChart"></canvas>
        <canvas id="bpChart"></canvas>
      </div>
    </Card>
  </div>
</template>

<script setup lang="ts">
/* ========================
   Imports
======================== */
import { ref, computed, onMounted, nextTick, watch, onUnmounted } from 'vue'
import { usePatientsStore } from '@/stores/patientsStore'
import { Chart, LineController, LineElement, PointElement, LinearScale, CategoryScale, Title, Tooltip, Legend } from 'chart.js'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useChartRefresh } from '@/composables/useChartRefresh.ts'

/* ========================
   Config Chart.js
======================== */
Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Title, Tooltip, Legend)

/* ========================
   📋 Props & Store
======================== */
const props = defineProps<{ patientId: number }>()
const patientsStore = usePatientsStore()
const patient = computed(() => patientsStore.getPatientById(props.patientId) ?? null)

/* ========================
   Gestion édition
======================== */
const isEditing = ref(false)
const editablePatient = ref<any>(null)

function editPatient() {
  if (patient.value) {
    editablePatient.value = { ...patient.value }
    isEditing.value = true
  }
}
function cancelEdit() {
  isEditing.value = false
  editablePatient.value = null
  renderCharts()
}
function saveEdit() {
  if (editablePatient.value) {
    patientsStore.updatePatient(editablePatient.value)
    isEditing.value = false
  }
}

/* ========================
    Gestion graphiques
======================== */
const showCombined = ref(true)
const toggleCombined = (val: boolean) => {
  showCombined.value = val
  renderCharts()
}

// Références graphiques
let combinedChart: Chart | null = null
let hrChart: Chart | null = null
let tempChart: Chart | null = null
let bpChart: Chart | null = null
let chartInterval: number | undefined

// Helpers pour seuils vitaux
const hrMin = (age: number) => (age < 18 ? 80 : age >= 65 ? 70 : 60)
const hrMax = (age: number) => (age < 18 ? 120 : age >= 65 ? 90 : 80)
const bpMinS = (age: number) => (age >= 65 ? 120 : 110)
const bpMaxS = (age: number) => (age >= 65 ? 150 : 140)
const bpMinD = (age: number) => (age >= 65 ? 70 : 60)
const bpMaxD = (age: number) => (age >= 65 ? 90 : 85)

// Rendu graphique
async function renderCharts() {
  await nextTick()
  combinedChart?.destroy()
  hrChart?.destroy()
  tempChart?.destroy()
  bpChart?.destroy()

  if (!patient.value) return

  const p = patient.value
  const canvasCombined = document.getElementById('vitalsChart') as HTMLCanvasElement | null
  const canvasHR = document.getElementById('hrChart') as HTMLCanvasElement | null
  const canvasTemp = document.getElementById('tempChart') as HTMLCanvasElement | null
  const canvasBP = document.getElementById('bpChart') as HTMLCanvasElement | null

  if (showCombined.value && canvasCombined) {
    combinedChart = new Chart(canvasCombined, {
      type: 'line',
      data: {
        labels: p.vitals.heartRate.map((_, i) => `T-${i}`),
        datasets: [
          {
            label: 'Fréquence cardiaque',
            data: p.vitals.heartRate,
            borderColor: 'red',
            tension: 0.3,
            pointRadius: 4,
            pointBackgroundColor: p.vitals.heartRate.map(
              hr => (hr < hrMin(p.age) || hr > hrMax(p.age)) ? 'red' : 'green'
            )
          },
          {
            label: 'Température',
            data: p.vitals.temperature,
            borderColor: 'orange',
            tension: 0.3,
            pointRadius: 4,
            pointBackgroundColor: p.vitals.temperature.map(
              t => (t < 36.3 || t > 37.5) ? 'red' : 'green'
            )
          },
          {
            label: 'Systolique',
            data: p.vitals.bloodPressure.map(bp => bp.systolic),
            borderColor: 'blue',
            tension: 0.3,
            pointRadius: 4,
            pointBackgroundColor: p.vitals.bloodPressure.map(
              bp => (bp.systolic < bpMinS(p.age) || bp.systolic > bpMaxS(p.age)) ? 'red' : 'green'
            )
          },
          {
            label: 'Diastolique',
            data: p.vitals.bloodPressure.map(bp => bp.diastolic),
            borderColor: 'green',
            tension: 0.3,
            pointRadius: 4,
            pointBackgroundColor: p.vitals.bloodPressure.map(
              bp => (bp.diastolic < bpMinD(p.age) || bp.diastolic > bpMaxD(p.age)) ? 'red' : 'green'
            )
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'top' },
          title: { display: true, text: 'Évolution des constantes vitales' }
        }
      }
    })
  } else {
    if (canvasHR) hrChart = new Chart(canvasHR, {
      type: 'line',
      data: {
        labels: p.vitals.heartRate.map((_, i) => `T-${i}`),
        datasets: [{ label: 'Fréquence cardiaque', data: p.vitals.heartRate, borderColor: 'red', tension: 0.3 }]
      }
    })
    if (canvasTemp) tempChart = new Chart(canvasTemp, {
      type: 'line',
      data: {
        labels: p.vitals.temperature.map((_, i) => `T-${i}`),
        datasets: [{ label: 'Température', data: p.vitals.temperature, borderColor: 'orange', tension: 0.3 }]
      }
    })
    if (canvasBP) bpChart = new Chart(canvasBP, {
      type: 'line',
      data: {
        labels: p.vitals.bloodPressure.map((_, i) => `T-${i}`),
        datasets: [
          { label: 'Systolique', data: p.vitals.bloodPressure.map(bp => bp.systolic), borderColor: 'blue', tension: 0.3 },
          { label: 'Diastolique', data: p.vitals.bloodPressure.map(bp => bp.diastolic), borderColor: 'green', tension: 0.3 }
        ]
      }
    })
  }
}

/* ========================
   Cycle de vie
======================== */
useChartRefresh(renderCharts)
onUnmounted(() => chartInterval && clearInterval(chartInterval))
watch([showCombined, patient], renderCharts)
</script>

<style scoped>
canvas {
  width: 100%;
  height: 300px;
}
</style>
