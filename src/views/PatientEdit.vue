<template>
  <div class="p-6 max-w-full mx-auto space-y-6">
    <!-- Formulaire d'édition -->
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

        <div class="flex gap-2 mt-4">
          <Button type="submit">💾 Enregistrer</Button>
          <Button type="button" variant="outline" @click="cancelEdit">❌ Annuler</Button>
        </div>
      </form>
    </Card>

    <!-- Patient introuvable -->
    <Card v-else class="p-6 border-dashed text-center">
      <p class="text-red-500 font-medium">⚠️ Patient introuvable.</p>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { usePatientsStore } from '@/stores/patientsStore'


import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const props = defineProps<{ patientId: number }>()
const router = useRouter()
const patientsStore = usePatientsStore()

const patient = computed(() => patientsStore.getPatientById(props.patientId) ?? null)

const isEditing = ref(true) // 👈 tu peux changer selon ton flux
const editablePatient = ref<any>(patient.value ? { ...patient.value } : null)

function saveEdit() {
  if (editablePatient.value) {
    patientsStore.updatePatient(editablePatient.value)
    isEditing.value = false
    router.push({
      name: 'PatientDetails',
      params: { id: props.patientId },
      query: { showToast: 'success' }
    })
  }
}

function cancelEdit() {
  isEditing.value = false
  router.push(`/patients/${props.patientId}`)
}
</script>
