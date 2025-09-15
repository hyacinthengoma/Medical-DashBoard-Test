<template>
  <span class="flex items-center">
    <span
      v-if="type === 'status'"
      :class="['w-5 h-5 rounded-full mr-2', statusClass]"
    ></span>
    <span v-else :class="valueClass">{{ value }} {{ unit }}</span>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { checkPatientStatus } from '@/utils/vitalsUtils';
import type { Patient } from '@/types/patient';

const props = defineProps<{
  patient: Patient;
  value: string | number;
  type: 'hr' | 'temp' | 'bp' | 'status';
}>();

const statusClass = computed(() => {
  const status = checkPatientStatus(props.patient);
  if (status === 'critical') return 'bg-red-500 animate-pulse';
  if (status === 'watch') return 'bg-yellow-400 animate-pulse';
  return 'bg-green-500';
});

const valueClass = computed(() => {
  if (props.type === 'status') return '';
  const status = checkPatientStatus(props.patient);
  if (props.type === 'hr' && (status === 'watch' || status === 'critical')) {
    const hr = props.patient.vitals.heartRate.slice(-1)[0];
    const age = props.patient.age;
    let hrRange = { min: 60, max: 80 };
    if (age < 18) hrRange = { min: 80, max: 120 };
    else if (age >= 65) hrRange = { min: 70, max: 90 };
    if (hr < hrRange.min || hr > hrRange.max) return 'text-red-600 font-semibold';
  }
  if (props.type === 'temp') {
    const temp = props.patient.vitals.temperature.slice(-1)[0];
    if (temp < 36.3 || temp > 37.5) return 'text-red-600 font-semibold';
  }
  if (props.type === 'bp') {
    const lastBP = props.patient.vitals.bloodPressure.slice(-1)[0];
    let bpRange = { systolic: [120, 140], diastolic: [60, 80] };
    if (props.patient.age >= 65) bpRange = { systolic: [140, 170], diastolic: [80, 100] };
    if (
      lastBP.systolic < bpRange.systolic[0] || lastBP.systolic > bpRange.systolic[1] ||
      lastBP.diastolic < bpRange.diastolic[0] || lastBP.diastolic > bpRange.diastolic[1]
    ) return 'text-red-600 font-semibold';
  }
  return '';
});

const unit = computed(() => {
  if (props.type === 'hr') return 'bpm';
  if (props.type === 'temp') return '°C';
  if (props.type === 'bp') return 'mmHg';
  return '';
});
</script>
