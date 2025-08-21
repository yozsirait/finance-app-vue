<template>
  <div class="h-72">
    <Bar :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from "vue";
import { Bar } from "vue-chartjs";
import { useChartOptions } from "@/composables/useChartOptions";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const props = defineProps({
  barChartData: { 
    type: Array, 
    default: () => [] 
  },
  currentMonth: { 
    type: Number, 
    default: new Date().getMonth() + 1 
  },
  currentYear: { 
    type: Number, 
    default: new Date().getFullYear() 
  }
});

const { options: baseOptions } = useChartOptions();
const isDark = ref(false);

// Deteksi dark mode
const checkDark = () => {
  isDark.value = document.documentElement.classList.contains("dark");
};

let observer;

onMounted(() => {
  checkDark();
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

// Override options khusus untuk bar chart
const chartOptions = computed(() => {
  const options = { ...baseOptions.value };
  
  options.scales = {
    x: {
      display: true,
      ticks: {
        color: isDark.value ? "#e5e7eb" : "#374151",
        font: {
          weight: 'bold'
        }
      },
      grid: {
        color: isDark.value ? "#374151" : "#e5e7eb",
        display: false,
      },
      title: {
        display: true,
        text: 'Kategori',
        color: isDark.value ? "#e5e7eb" : "#374151",
        font: {
          size: 14,
          weight: 'bold'
        }
      }
    },
    y: {
      display: true,
      ticks: {
        color: isDark.value ? "#e5e7eb" : "#374151",
        callback: function(value) {
          if (value >= 1000000) {
            return 'Rp' + (value / 1000000).toFixed(1) + 'Jt';
          } else if (value >= 1000) {
            return 'Rp' + (value / 1000).toFixed(0) + 'Rb';
          }
          return 'Rp' + value;
        }
      },
      grid: {
        color: isDark.value ? "#374151" : "#e5e7eb",
      },
      beginAtZero: true,
      title: {
        display: true,
        text: 'Jumlah (Rupiah)',
        color: isDark.value ? "#e5e7eb" : "#374151",
        font: {
          size: 14,
          weight: 'bold'
        }
      }
    },
  };
  
  options.plugins = {
    ...options.plugins,
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
      callbacks: {
        title: function(context) {
          return context[0].label;
        },
        label: function(context) {
          const datasetLabel = context.dataset.label || '';
          const value = context.parsed.y;
          return `${datasetLabel}: Rp${new Intl.NumberFormat('id-ID').format(value)}`;
        }
      }
    },
    legend: {
      display: true,
      position: 'top',
      labels: {
        color: isDark.value ? "#e5e7eb" : "#374151",
        usePointStyle: true,
        padding: 20,
        font: {
          size: 12
        }
      }
    },
    title: {
      display: true,
      text: `Pendapatan vs Pengeluaran per Kategori (${props.currentMonth}/${props.currentYear})`,
      color: isDark.value ? "#e5e7eb" : "#374151",
      font: {
        size: 16,
        weight: 'bold'
      },
      padding: {
        top: 10,
        bottom: 20
      }
    }
  };
  
  return options;
});

const chartData = computed(() => {
  // Filter hanya kategori yang memiliki data (income atau expense > 0)
  const filteredData = props.barChartData.filter(
    item => item.income > 0 || item.expense > 0
  );

  return {
    labels: filteredData.map(item => item.category),
    datasets: [
      {
        label: "Pendapatan",
        data: filteredData.map(item => item.income),
        backgroundColor: isDark.value ? "#16a34a" : "#4ade80", // Green
        borderColor: isDark.value ? "#166534" : "#22c55e",
        borderWidth: 1,
        borderRadius: 4,
        hoverBackgroundColor: isDark.value ? "#15803d" : "#86efac",
        barPercentage: 0.4,
        categoryPercentage: 0.6,
      },
      {
        label: "Pengeluaran",
        data: filteredData.map(item => item.expense),
        backgroundColor: isDark.value ? "#dc2626" : "#f87171", // Red
        borderColor: isDark.value ? "#991b1b" : "#ef4444",
        borderWidth: 1,
        borderRadius: 4,
        hoverBackgroundColor: isDark.value ? "#b91c1c" : "#fca5a5",
        barPercentage: 0.4,
        categoryPercentage: 0.6,
      }
    ],
  };
});
</script>

<style scoped>
::v-deep canvas {
  background-color: transparent !important;
}
</style>