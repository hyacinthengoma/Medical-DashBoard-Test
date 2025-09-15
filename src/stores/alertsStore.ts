import { defineStore } from 'pinia';

interface Alert {
  patientId: number;
  message: string;
  date: Date;
}

export const useAlertsStore = defineStore('alerts', {
  state: () => ({
    alerts: [] as Alert[]
  }),
  actions: {
    addAlert(alert: Alert) {
      this.alerts.push(alert);
    }
  }
});
