import { onMounted, onUnmounted } from 'vue';
import { useToast } from 'vue-toastification';
import { usePatientsStore } from '@/stores/patientsStore';
import { useVitalsAlert } from '@/composables/useVitalsAlert';

export function useVitalsSimulation(intervalMs = 60000) {
  const patientsStore = usePatientsStore();
  const { alerts, checkAllPatients } = useVitalsAlert();
  const toast = useToast();
  let interval: number;

  function simulateVitals() {
    patientsStore.patients.forEach(patient => {
      patient.vitals.heartRate.push(
        Math.max(40, Math.min(160, patient.vitals.heartRate.slice(-1)[0] + (Math.random() * 10 - 5)))
      );

      patient.vitals.temperature.push(
        Math.max(35, Math.min(41, patient.vitals.temperature.slice(-1)[0] + (Math.random() * 0.5 - 0.25)))
      );

      const lastBP = patient.vitals.bloodPressure.slice(-1)[0];
      patient.vitals.bloodPressure.push({
        systolic: Math.max(90, Math.min(180, lastBP.systolic + Math.floor(Math.random() * 6 - 3))),
        diastolic: Math.max(50, Math.min(120, lastBP.diastolic + Math.floor(Math.random() * 6 - 3))),
      });
    });
  }

  onMounted(() => {
    interval = window.setInterval(() => {
      simulateVitals();
      checkAllPatients();
      alerts.value?.forEach(alert => {
        if (alert.status === 'critical') {
          toast.error(`CRITIQUE ! Patient ${alert.patientId} : ${alert.status}`);
        }
      });
    }, intervalMs);
  });

  onUnmounted(() => clearInterval(interval));
}
