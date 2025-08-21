import { computed, ref, onMounted, onUnmounted } from "vue";

export function useChartOptions() {
  const isDark = ref(false);

  // cek dark class di <html>
  const checkDark = () => {
    isDark.value = document.documentElement.classList.contains("dark");
  };

  let observer;

  onMounted(() => {
    checkDark();
    // observer biar update kalau class dark/light berubah
    observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
  });

  onUnmounted(() => {
    if (observer) {
      observer.disconnect();
    }
  });

  const options = computed(() => ({
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        display: false,
        ticks: {
          color: isDark.value ? "#e5e7eb" : "#374151",
        },
        grid: {
          display: false,
          color: isDark.value ? "#374151" : "#e5e7eb",
        },
      },
      y: {
        display: false,
        ticks: {
          color: isDark.value ? "#e5e7eb" : "#374151",
        },
        grid: {
          display: false,
          color: isDark.value ? "#374151" : "#e5e7eb",
        },
      },
    },
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: isDark.value ? "#e5e7eb" : "#374151",
          usePointStyle: true,
          padding: 20,
          font: {
            size: 14
          }
        },
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: isDark.value ? "#1f2937" : "#ffffff",
        titleColor: isDark.value ? "#e5e7eb" : "#374151",
        bodyColor: isDark.value ? "#e5e7eb" : "#374151",
        borderColor: isDark.value ? "#374151" : "#e5e7eb",
        borderWidth: 1,
        padding: 12,
        cornerRadius: 6,
        displayColors: true,
        boxPadding: 4,
      },
    },
    elements: {
      arc: {
        borderWidth: 2,
        borderColor: isDark.value ? "#1f2937" : "#ffffff",
      }
    }
  }));

  return { options, isDark }; // Kembalikan isDark juga
}