<template>
  <div class="h-72 relative">
    <Pie v-if="hasData" :data="chartData" :options="chartOptions" />
    <div v-else class="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
      No data available
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { Pie } from "vue-chartjs";
import { useChartOptions } from "@/composables/useChartOptions";
import { generateColors } from "@/utils/colors";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(Title, Tooltip, Legend, ArcElement);

const props = defineProps({
  categories: { type: Array, default: () => [] },
});

const { options: baseOptions, isDark } = useChartOptions();

// Override options khusus untuk pie chart
const chartOptions = computed(() => {
  const options = { ...baseOptions.value };
  // options.scales = {
  //   x: { display: false },
  //   y: { display: false },
  // };
  // Hapus scales sepenuhnya supaya PieChart tidak error
  delete options.scales;
  
  return options;
});

// Cek apakah ada data untuk chart
const hasData = computed(() => props.categories && props.categories.length > 0);

const chartData = computed(() => ({
  labels: hasData.value ? props.categories.map((c) => c.name) : [],
  datasets: [
    {
      label: "Top Categories",
      data: hasData.value ? props.categories.map((c) => c.total) : [],
      backgroundColor: hasData.value
        ? generateColors(props.categories.length, isDark.value)
        : [],
      borderWidth: 2,
      hoverBorderWidth: 3,
      borderColor: isDark.value ? "#1f2937" : "#ffffff",
    },
  ],
}));
</script>

<style scoped>
::v-deep canvas {
  background-color: transparent !important;
}
</style>
