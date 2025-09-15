// src/stores/patientsStore.ts
import { defineStore } from 'pinia';
import type { Patient } from '@/types/patient';
import mockPatients from '../assets/mockPatients.json';

export const usePatientsStore = defineStore('patients', {
  state: () => ({
    patients: validateMockPatients(
      JSON.parse(localStorage.getItem('patients') || 'null') ?? mockPatients
    ),
    searchQuery: '',
  }),
  getters: {
    filteredPatients: (state) => {
      if (!state.searchQuery) return state.patients;
      const q = state.searchQuery.toLowerCase();
      return state.patients.filter(
        (p: Patient) =>
          p.firstName.toLowerCase().includes(q) ||
          p.lastName.toLowerCase().includes(q) ||
          p.medicalRecordNumber.toLowerCase().includes(q)
      );
    },
    getPatientById: (state) => {
      return (id: number) => state.patients.find((p: Patient) => p.id === id);
    },
  },
  actions: {
    setSearchQuery(query: string) {
      this.searchQuery = query;
    },
    updatePatient(updatedPatient: Patient) {
      const index = this.patients.findIndex((p: Patient) => p.id === updatedPatient.id);
      if (index !== -1) {
        this.patients.splice(index, 1, updatedPatient);
        localStorage.setItem('patients', JSON.stringify(this.patients));
      }
    },
    async fetchPatients() {
      this.patients = validateMockPatients(mockPatients as Patient[]);
      localStorage.setItem('patients', JSON.stringify(this.patients));
    },
  },
});

// --- Validation helpers ---
function validateMockPatients(data: unknown): Patient[] {
  if (Array.isArray(data)) {
    return data.filter((item, index) => {
      if (!isValidPatient(item)) {
        console.error(`Patient invalide à l’index ${index}:`, item);
        return false;
      }
      return true;
    }) as Patient[];
  }
  console.error('Mauvais format de données (tableau attendu).', data);
  return [];
}

function isValidPatient(obj: unknown): obj is Patient {
  if (typeof obj !== 'object' || obj === null) return false;
  const patient = obj as Patient;
  return (
    typeof patient.id === 'number' &&
    typeof patient.firstName === 'string' &&
    typeof patient.lastName === 'string' &&
    typeof patient.age === 'number' &&
    typeof patient.medicalRecordNumber === 'string' &&
    patient.vitals &&
    Array.isArray(patient.vitals.heartRate) &&
    Array.isArray(patient.vitals.temperature) &&
    Array.isArray(patient.vitals.bloodPressure) &&
    patient.vitals.bloodPressure.every(
      (bp: unknown) =>
        typeof (bp as { systolic: number; diastolic: number }).systolic === 'number' &&
        typeof (bp as { systolic: number; diastolic: number }).diastolic === 'number'
    ) &&
    Array.isArray(patient.vitals.oxygenSaturation)
  );
}
