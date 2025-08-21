<template>
  <div class="h-72 relative">
    <Pie :data="chartData" :options="chartOptions" />
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
  
  // Pastikan scales tidak ditampilkan untuk pie chart
  options.scales = {
    x: { display: false },
    y: { display: false }
  };
  
  return options;
});

const chartData = computed(() => ({
  labels: props.categories.map((c) => c.name),
  datasets: [
    {
      label: "Top Categories",
      data: props.categories.map((c) => c.total),
      backgroundColor: generateColors(props.categories.length, isDark.value),
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