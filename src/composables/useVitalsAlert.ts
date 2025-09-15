import { ref, onMounted, onUnmounted } from 'vue';
import { usePatientsStore } from '@/stores/patientsStore';
import { checkPatientStatus } from '@/utils/vitalsUtils';
import { useToast } from 'vue-toastification';

const ALERT_INTERVAL = 60000;

export function useVitalsAlert() {
  const patientsStore = usePatientsStore();
  const alerts = ref<{ patientId: number; status: string }[]>([]);
  const toast = useToast();
  let intervalId: number | undefined;

  const triggerAlert = (patientId: number, status: string) => {
    if (!alerts.value.find(a => a.patientId === patientId && a.status === status)) {
      alerts.value.push({ patientId, status });
      toast.warning(`⚠️ Alerte patient ${patientId} : ${status}`);
    }
  };

  const checkAllPatients = () => {
    alerts.value = [];
    patientsStore.patients.forEach(p => {
      const status = checkPatientStatus(p);
      if (status !== 'normal') {
        alerts.value.push({ patientId: p.id, status });
        toast.warning(`⚠️ Alerte patient ${p.id} : ${status}`);
      }
    });
  };

  onMounted(() => {
    checkAllPatients();
    intervalId = window.setInterval(checkAllPatients, ALERT_INTERVAL);
  });

  onUnmounted(() => {
    if (intervalId) clearInterval(intervalId);
  });

  return { alerts, checkAllPatients };
}
