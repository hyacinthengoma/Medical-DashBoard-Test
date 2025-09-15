import { ref, nextTick, onMounted, onUnmounted, watch } from 'vue'
import { Chart } from 'chart.js'

export function useVitalsChart(
  patientRef: any,
  refreshInterval = 60000) {
  const showCombined = ref(true)
  let combinedChart: Chart | null = null
  let hrChart: Chart | null = null
  let tempChart: Chart | null = null
  let bpChart: Chart | null = null
  let chartInterval: number | undefined

  const toggleCombined = (val: boolean) => {
    showCombined.value = val
    renderCharts()
  }

  // ==========================
  // Helpers pour les seuils vitaux
  // ==========================
  const hrMin = (age: number) => (age < 18 ? 80 : age >= 65 ? 70 : 60)
  const hrMax = (age: number) => (age < 18 ? 120 : age >= 65 ? 90 : 80)
  const bpMinS = (age: number) => (age >= 65 ? 120 : 110)
  const bpMaxS = (age: number) => (age >= 65 ? 150 : 140)
  const bpMinD = (age: number) => (age >= 65 ? 70 : 60)
  const bpMaxD = (age: number) => (age >= 65 ? 90 : 85)

  // ==========================
  // Fonction de rendu des graphiques
  // ==========================
  async function renderCharts() {
    await nextTick()
    if (!patientRef.value) return

    const p = patientRef.value

    // Destruction des charts existants
    combinedChart?.destroy()
    hrChart?.destroy()
    tempChart?.destroy()
    bpChart?.destroy()

    const canvasCombined = document.getElementById('vitalsChart') as HTMLCanvasElement | null
    const canvasHR = document.getElementById('hrChart') as HTMLCanvasElement | null
    const canvasTemp = document.getElementById('tempChart') as HTMLCanvasElement | null
    const canvasBP = document.getElementById('bpChart') as HTMLCanvasElement | null

    // Graphique combiné
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
              pointBackgroundColor: p.vitals.heartRate.map((hr) =>
                hr < hrMin(p.age) || hr > hrMax(p.age) ? 'red' : 'green',
              ),
            },
            {
              label: 'Température',
              data: p.vitals.temperature,
              borderColor: 'orange',
              tension: 0.3,
              pointRadius: 4,
              pointBackgroundColor: p.vitals.temperature.map((t) =>
                t < 36.3 || t > 37.5 ? 'red' : 'green',
              ),
            },
            {
              label: 'Systolique',
              data: p.vitals.bloodPressure.map((bp) => bp.systolic),
              borderColor: 'blue',
              tension: 0.3,
              pointRadius: 4,
              pointBackgroundColor: p.vitals.bloodPressure.map((bp) =>
                bp.systolic < bpMinS(p.age) || bp.systolic > bpMaxS(p.age) ? 'red' : 'green',
              ),
            },
            {
              label: 'Diastolique',
              data: p.vitals.bloodPressure.map((bp) => bp.diastolic),
              borderColor: 'green',
              tension: 0.3,
              pointRadius: 4,
              pointBackgroundColor: p.vitals.bloodPressure.map((bp) =>
                bp.diastolic < bpMinD(p.age) || bp.diastolic > bpMaxD(p.age) ? 'red' : 'green',
              ),
            },
          ],
        },
        options: { responsive: true },
      })
    } else {
      // Graphiques séparés
      if (canvasHR)
        hrChart = new Chart(canvasHR, {
          type: 'line',
          data: {
            labels: p.vitals.heartRate.map((_, i) => `T-${i}`),
            datasets: [
              {
                label: 'Fréquence cardiaque',
                data: p.vitals.heartRate,
                borderColor: 'red',
                tension: 0.3,
              },
            ],
          },
        })
      if (canvasTemp)
        tempChart = new Chart(canvasTemp, {
          type: 'line',
          data: {
            labels: p.vitals.temperature.map((_, i) => `T-${i}`),
            datasets: [
              {
                label: 'Température',
                data: p.vitals.temperature,
                borderColor: 'orange',
                tension: 0.3,
              },
            ],
          },
        })
      if (canvasBP)
        bpChart = new Chart(canvasBP, {
          type: 'line',
          data: {
            labels: p.vitals.bloodPressure.map((_, i) => `T-${i}`),
            datasets: [
              {
                label: 'Systolique',
                data: p.vitals.bloodPressure.map((bp) => bp.systolic),
                borderColor: 'blue',
                tension: 0.3,
              },
              {
                label: 'Diastolique',
                data: p.vitals.bloodPressure.map((bp) => bp.diastolic),
                borderColor: 'green',
                tension: 0.3,
              },
            ],
          },
        })
    }
  }

  // ==========================
  // Cycle de vie
  // ==========================
  onMounted(() => {
    renderCharts()
    chartInterval = window.setInterval(renderCharts, refreshInterval)
  })

  onUnmounted(() => {
    if (chartInterval) clearInterval(chartInterval)
  })

  watch([showCombined, patientRef], renderCharts)

  return { showCombined, toggleCombined, renderCharts }
}
