<template>
  <div class="space-y-6">
    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="p-6 rounded-2xl shadow bg-white dark:bg-gray-800">
        <div class="flex items-center justify-between">
          <h2 class="text-sm text-gray-500 dark:text-gray-400">Balance</h2>
          <Wallet class="w-6 h-6 text-blue-500" />
        </div>
        <p class="mt-2 text-2xl font-bold text-gray-800 dark:text-gray-100">
          {{ summary.balance | currency }}
        </p>
      </div>

      <div class="p-6 rounded-2xl shadow bg-white dark:bg-gray-800">
        <div class="flex items-center justify-between">
          <h2 class="text-sm text-gray-500 dark:text-gray-400">Income</h2>
          <TrendingUp class="w-6 h-6 text-green-500" />
        </div>
        <p class="mt-2 text-2xl font-bold text-gray-800 dark:text-gray-100">
          {{ summary.income | currency }}
        </p>
      </div>

      <div class="p-6 rounded-2xl shadow bg-white dark:bg-gray-800">
        <div class="flex items-center justify-between">
          <h2 class="text-sm text-gray-500 dark:text-gray-400">Expense</h2>
          <TrendingDown class="w-6 h-6 text-red-500" />
        </div>
        <p class="mt-2 text-2xl font-bold text-gray-800 dark:text-gray-100">
          {{ summary.expense | currency }}
        </p>
      </div>
    </div>

    <!-- Chart Section -->
    <div class="p-6 rounded-2xl shadow bg-white dark:bg-gray-800">
      <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
        Expense by Category
      </h2>
      <ResponsiveContainer width="100%" height="300">
        <PieChart>
          <Pie
            dataKey="value"
            data="chartData"
            :data="chartData"
            cx="50%"
            cy="50%"
            outerRadius="100"
            label
          >
            <Cell
              v-for="(entry, index) in chartData"
              :key="index"
              :fill="colors[index % colors.length]"
            />
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { Wallet, TrendingUp, TrendingDown } from "lucide-vue-next";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// summary state
const summary = ref({
  balance: 0,
  income: 0,
  expense: 0,
});

// chart data
const chartData = ref([]);
const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

onMounted(async () => {
  try {
    const { data } = await axios.get("/api/dashboard", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });

    // assign summary
    summary.value = {
      balance: data.balance ?? 0,
      income: data.income ?? 0,
      expense: data.expense ?? 0,
    };

    // example category breakdown
    chartData.value = (data.categories || []).map((c) => ({
      name: c.name,
      value: c.expense,
    }));
  } catch (err) {
    console.error("Failed to load dashboard:", err);
  }
});

// currency filter
const currency = (val) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(val);

</script>
