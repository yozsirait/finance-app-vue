<template>
  <div class="space-y-6">
    <!-- Summary Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div v-for="card in summaryCards" :key="card.label"
        class="p-4 bg-white dark:bg-gray-800 rounded-2xl shadow hover:shadow-md transition">
        <div class="flex justify-between items-center">
          <div>
            <h2 class="text-sm text-gray-500 dark:text-gray-400">{{ card.label }}</h2>
            <p class="text-2xl font-bold text-gray-800 dark:text-gray-100">
              Rp {{ formatNumber(card.value) }}
            </p>
          </div>
          <component :is="card.icon" class="w-8 h-8 text-blue-500" />
        </div>
      </div>
    </div>

    <!-- Charts -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Pie Chart: Expense by Category -->
      <div class="p-4 bg-white dark:bg-gray-800 rounded-2xl shadow">
        <h2 class="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">
          Expense by Category
        </h2>
        <PieChart v-if="dashboardData.pie_chart_data?.length" :categories="dashboardData.pie_chart_data" />
        <p v-else class="text-gray-400">No category data available.</p>
      </div>

      <!-- Bar Chart: Income vs Expense per Category -->
      <div class="p-4 bg-white dark:bg-gray-800 rounded-2xl shadow">
        <h2 class="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">
          Income vs Expense per Category
        </h2>
        <BarChart v-if="hasBarChartData" :bar-chart-data="dashboardData.bar_chart_data"
          :current-month="dashboardData.current_month" :current-year="dashboardData.current_year" />
        <p v-else class="text-gray-400">No bar chart data available.</p>
      </div>
    </div>

    <!-- Top Transactions -->
    <div class="p-4 bg-white dark:bg-gray-800 rounded-2xl shadow">
      <h2 class="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">Top Transactions</h2>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-4 py-2 text-left text-sm font-semibold">Date</th>
              <th class="px-4 py-2 text-left text-sm font-semibold">Description</th>
              <th class="px-4 py-2 text-left text-sm font-semibold">Category</th>
              <th class="px-4 py-2 text-left text-sm font-semibold">Type</th>
              <th class="px-4 py-2 text-right text-sm font-semibold">Amount</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-if="!enrichedTransactions.length">
              <td colspan="5" class="px-4 py-4 text-center text-gray-400 dark:text-gray-500">
                No Data Available
              </td>
            </tr>
            <tr v-else v-for="tx in enrichedTransactions" :key="tx.ID">
              <td class="px-4 py-2 text-sm">{{ formatDate(tx.Date) }}</td>
              <td class="px-4 py-2 text-sm">{{ tx.Description }}</td>
              <td class="px-4 py-2 text-sm">{{ tx.CategoryName || "-" }}</td>
              <td class="px-4 py-2 text-sm capitalize">
                <span :class="tx.Type === 'income' ? 'text-green-500' : 'text-red-500'">{{ tx.Type }}</span>
              </td>
              <td class="px-4 py-2 text-sm text-right">Rp {{ formatNumber(tx.Amount) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import api from "@/utils/axios";
import { Wallet, TrendingUp, TrendingDown, PiggyBank } from "lucide-vue-next";
import PieChart from "@/components/PieChart.vue";
import BarChart from "@/components/BarChart.vue";

const dashboardData = ref({
  bar_chart_data: [],
  pie_chart_data: [],
  top_transactions: [],
  current_month: new Date().getMonth() + 1,
  current_year: new Date().getFullYear(),
  income_this_month: 0,
  expense_this_month: 0,
  net_savings: 0,
  total_balance: 0
});

const categories = ref([]);


const summaryCards = computed(() => [
  { label: "Income", value: dashboardData.value.income_this_month || 0, icon: TrendingUp },
  { label: "Expense", value: dashboardData.value.expense_this_month || 0, icon: TrendingDown },
  { label: "Savings", value: dashboardData.value.net_savings || 0, icon: PiggyBank },
  { label: "Balance", value: dashboardData.value.total_balance || 0, icon: Wallet },
]);

// Check if bar chart has meaningful data
const hasBarChartData = computed(() => {
  if (!dashboardData.value.bar_chart_data?.length) return false;

  return dashboardData.value.bar_chart_data.some(
    item => item.income > 0 || item.expense > 0
  );
});

// Enrich transactions with category names
const enrichedTransactions = computed(() => {
  if (!dashboardData.value.top_transactions?.length) return [];

  return dashboardData.value.top_transactions.map(tx => {
    const category = categories.value.find(cat => cat.ID === tx.CategoryID);
    return {
      ...tx,
      CategoryName: category ? category.Name : "-"
    };
  });
});

const userId = localStorage.getItem("user_id"); // ambil user_id login

// Fetch categories
const fetchCategories = async () => {
  try {    
    const { data } = await api.get(`/api/categories?user_id=${userId}`);
    if (data.success) {
      categories.value = data.data;
    }
  } catch (err) {
    console.error("Failed to load categories:", err);
  }
};

// Fetch dashboard data
const fetchDashboardData = async () => {
  try {    
    const { data } = await api.get(`/api/dashboard?user_id=${userId}`);
    if (data.success) {
      dashboardData.value = data.data;
    }
  } catch (err) {
    console.error("Failed to load dashboard:", err);
  }
};

onMounted(async () => {
  await Promise.all([fetchDashboardData(), fetchCategories()]);
});

const formatNumber = (val) =>
  new Intl.NumberFormat("id-ID").format(val || 0);

const formatDate = (val) =>
  new Date(val).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
</script>