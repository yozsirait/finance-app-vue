<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100">Budgets</h1>
      <button @click="showAddModal = true"
        class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
        <Plus class="w-5 h-5" />
        Add Budget
      </button>
    </div>

    <!-- Toast -->
    <transition name="fade">
      <div v-if="toastMessage" class="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
        <div
          :class="[
            'px-6 py-3 rounded-lg shadow-lg text-white',
            toastType === 'success' ? 'bg-green-600' : 'bg-red-600'
          ]">
          {{ toastMessage }}
        </div>
      </div>
    </transition>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>

    <!-- Error Message -->
    <!-- <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
      {{ error }}
    </div> -->

    <!-- Budgets Table -->
    <div v-if="!loading && budgets.length > 0" class="bg-white dark:bg-gray-800 rounded-2xl shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Category</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amount</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Period</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Created At</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Updated At</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="budget in budgets" :key="budget.ID">
              <td class="px-6 py-4">{{ getCategoryName(budget.CategoryID) }}</td>
              <td class="px-6 py-4">{{ formatCurrency(budget.Amount) }}</td>
              <td class="px-6 py-4 capitalize">{{ budget.Period }}</td>
              <td class="px-6 py-4">{{ formatDate(budget.CreatedAt) }}</td>
              <td class="px-6 py-4">{{ formatDate(budget.UpdatedAt) }}</td>
              <td class="px-6 py-4 text-right">
                <button @click="openEditModal(budget)" class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-4">Edit</button>
                <button @click="confirmDelete(budget)" class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="!loading && budgets.length === 0" class="text-center py-12">
      <Users class="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No budgets yet</h3>
      <p class="text-gray-500 dark:text-gray-400 mb-4">Get started by adding your first budget.</p>
      <button @click="showAddModal = true" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg">Add Budget</button>
    </div>

    <!-- Add/Edit Modal -->
    <Modal :show="showAddModal || showEditModal" @close="closeModal">
      <div class="p-6">
        <h2 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
          {{ isEditing ? 'Edit Budget' : 'Add New Budget' }}
        </h2>
        <form @submit.prevent="isEditing ? updateBudget() : createBudget()">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category *</label>
            <select v-model="form.CategoryID" required
              class="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white">
              <option value="" disabled>Select category</option>
              <option v-for="cat in categories" :key="cat.ID" :value="cat.ID">{{ cat.Name }}</option>
            </select>
          </div>
          <CurrencyInput v-model="form.Amount" label="Amount (IDR)" />
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Period *</label>
            <select v-model="form.Period" required
              class="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white">
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
          <div class="flex justify-end gap-3">
            <button type="button" @click="closeModal"
              class="px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded-md">Cancel</button>
            <button type="submit" :disabled="loadingForm"
              class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50">
              {{ loadingForm ? 'Saving...' : (isEditing ? 'Update' : 'Create') }}
            </button>
          </div>
        </form>
      </div>
    </Modal>

    <!-- Delete Confirmation Modal -->
    <Modal :show="showDeleteModal" @close="showDeleteModal = false">
      <div class="p-6">
        <h2 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Confirm Delete</h2>
        <p class="text-gray-600 dark:text-gray-400 mb-6">
          Are you sure you want to delete this budget ({{ formatCurrency(budgetToDelete?.Amount) }})?
        </p>
        <div class="flex justify-end gap-3">
          <button @click="showDeleteModal = false" class="px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded-md">Cancel</button>
          <button @click="deleteBudget" :disabled="loadingDelete"
            class="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50">
            {{ loadingDelete ? 'Deleting...' : 'Delete' }}
          </button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { Plus, Users } from "lucide-vue-next";
import Modal from "@/components/Modal.vue";
import api from "@/utils/axios";
import CurrencyInput from "@/components/CurrencyInput.vue";

const budgets = ref([]);
const categories = ref([]);
const loading = ref(false);
const error = ref("");
const showAddModal = ref(false);
const showEditModal = ref(false);
const showDeleteModal = ref(false);
const loadingForm = ref(false);
const loadingDelete = ref(false);
const isEditing = ref(false);
const budgetToDelete = ref(null);

const toastMessage = ref("");
const toastType = ref("success");

const form = ref({ ID: null, CategoryID: "", Amount: "", Period: "monthly" });

// Toast helper
const showToast = (msg, type = "success") => {
  toastMessage.value = msg;
  toastType.value = type;
  setTimeout(() => { toastMessage.value = ""; }, 3000);
};

// Fetch
const fetchBudgets = async () => {
  try {
    loading.value = true;
    const { data } = await api.get("/api/budgets");
    if (data.success) budgets.value = data.data;
  } catch (err) {
    error.value = "Failed to load budgets: " + (err.response?.data?.message || err.message);
    showToast(error.value, "error");
  } finally {
    loading.value = false;
  }
};

const fetchCategories = async () => {
  try {
    const { data } = await api.get("/api/categories?type=expense");
    if (data.success) categories.value = data.data;
  } catch (err) {
    console.error("Failed to fetch categories:", err);
  }
};

// Create
const createBudget = async () => {
  try {
    loadingForm.value = true;
    const payload = {
      category_id: form.value.CategoryID,
      amount: form.value.Amount,
      period: form.value.Period
    };
    const { data } = await api.post("/api/budgets", payload);
    if (data.success) {
      budgets.value.push(data.data);
      closeModal();
      showToast("Budget created successfully!");
    }
  } catch (err) {
    // const msg = "Failed to create budget: " + (err.response?.data?.message || err.message);
    const msg = (err.response?.data?.message || err.message);
    error.value = msg;
    closeModal();
    showToast(msg, "error");
  } finally {
    loadingForm.value = false;
  }
};

// Update
const updateBudget = async () => {
  try {
    loadingForm.value = true;
    const payload = {
      category_id: form.value.CategoryID,
      amount: form.value.Amount,
      period: form.value.Period
    };
    const { data } = await api.put(`/api/budgets/${form.value.ID}`, payload);
    if (data.success) {
      const idx = budgets.value.findIndex(b => b.ID === form.value.ID);
      if (idx !== -1) budgets.value[idx] = data.data;
      closeModal();
      showToast("Budget updated successfully!");
    }
  } catch (err) {
    // const msg = "Failed to update budget: " + (err.response?.data?.message || err.message);
    const msg = (err.response?.data?.message || err.message);
    error.value = msg;
    closeModal();
    showToast(msg, "error");
  } finally {
    loadingForm.value = false;
  }
};


// Delete
const deleteBudget = async () => {
  try {
    loadingDelete.value = true;
    const { data } = await api.delete(`/api/budgets/${budgetToDelete.value.ID}`);
    if (data.success) {
      budgets.value = budgets.value.filter(b => b.ID !== budgetToDelete.value.ID);
      showDeleteModal.value = false;
      showToast("Budget deleted successfully!");
    }
  } catch (err) {
    const msg = "Failed to delete budget: " + (err.response?.data?.message || err.message);
    error.value = msg;
    showToast(msg, "error");
  } finally {
    loadingDelete.value = false;
  }
};

// Open edit
const openEditModal = (budget) => {
  isEditing.value = true;
  form.value = { ...budget };
  showEditModal.value = true;
};

// Confirm delete
const confirmDelete = (budget) => {
  budgetToDelete.value = budget;
  showDeleteModal.value = true;
};

// Close modal
const closeModal = () => {
  showAddModal.value = false;
  showEditModal.value = false;
  isEditing.value = false;
  form.value = { ID: null, CategoryID: "", Amount: "", Period: "monthly" };
};

// Helpers
const formatDate = (dateString) => new Date(dateString).toLocaleString("id-ID");
const formatCurrency = (num) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(num);
const getCategoryName = (id) => categories.value.find(c => c.ID === id)?.Name || "-";


onMounted(() => {
  fetchBudgets();
  fetchCategories();
});
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
