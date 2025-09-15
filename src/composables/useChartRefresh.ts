import { onMounted, onUnmounted } from 'vue'

const DEFAULT_SECONDS = 60

export function useChartRefresh(renderFn: () => void) {
  let intervalId: number | undefined
  const intervalMs = DEFAULT_SECONDS * 1000

  onMounted(() => {
    renderFn()
    intervalId = window.setInterval(() => {
      console.log(`⏳ Actualisation du graphique toutes les ${DEFAULT_SECONDS}s`)
      renderFn()
    }, intervalMs)
  })

  onUnmounted(() => {
    if (intervalId) clearInterval(intervalId)
  })
}
