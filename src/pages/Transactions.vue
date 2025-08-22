<template>
    <div>
        <!-- Header -->
        <div class="flex justify-between items-center mb-6">
            <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100">
                Transactions
            </h1>
            <button @click="openForm()" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                + Add Transaction
            </button>
        </div>

        <!-- Transactions Table -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow overflow-x-auto">
            <table class="w-full table-auto text-left">
                <thead class="bg-gray-100 dark:bg-gray-700">
                    <tr>
                        <th class="p-3">Date</th>
                        <th class="p-3">Description</th>
                        <th class="p-3">Category</th>
                        <th class="p-3">Member</th>
                        <th class="p-3">Account</th>
                        <th class="p-3">Type</th>
                        <th class="p-3 text-right">Amount</th>
                        <th class="p-3 text-center">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="!transactions.length">
                        <td colspan="8" class="px-4 py-4 text-center text-gray-400 dark:text-gray-500">
                            No Transaction Available
                        </td>
                    </tr>
                    <tr v-else v-for="tx in transactions" :key="tx.ID" class="border-b dark:border-gray-700">
                        <td class="p-3">{{ formatDate(tx.Date) }}</td>
                        <td class="p-3">{{ tx.Description }}</td>
                        <td class="p-3">{{ tx.Category?.Name || "-" }}</td>
                        <td class="p-3">{{ tx.Member?.Name || "-" }}</td>
                        <td class="p-3">{{ tx.Account?.Name || "-" }}</td>
                        <td class="p-3 capitalize">{{ tx.Type }}</td>
                        <td class="p-3 text-right">
                            <span :class="tx.Type === 'income' ? 'text-green-500' : 'text-red-500'">
                                {{ formatCurrency(tx.Amount) }}
                            </span>
                        </td>
                        <td class="p-3 text-center space-x-2">
                            <button @click="openForm(tx)"
                                class="px-2 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500">
                                Edit
                            </button>
                            <button @click="deleteTransaction(tx.ID)"
                                class="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600">
                                Delete
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Modal Form -->
        <div v-if="showForm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg w-full max-w-lg">
                <h2 class="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
                    {{ form.ID ? "Edit Transaction" : "Add Transaction" }}
                </h2>

                <form @submit.prevent="saveTransaction">
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm mb-1">Date</label>
                            <input v-model="form.Date" type="date"
                                class="w-full p-2 border rounded dark:bg-gray-700 dark:text-white" required />
                        </div>
                        <div>
                            <label class="block text-sm mb-1">Type</label>
                            <select v-model="form.Type"
                                class="w-full p-2 border rounded dark:bg-gray-700 dark:text-white" required>
                                <option value="income">Income</option>
                                <option value="expense">Expense</option>
                            </select>
                        </div>
                    </div>

                    <div class="mt-3">
                        <label class="block text-sm mb-1">Description</label>
                        <input v-model="form.Description" type="text"
                            class="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                            placeholder="e.g. Salary, Shopping..." required />
                    </div>

                    <div class="mt-3 grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm mb-1">Category</label>
                            <select v-model="form.CategoryID"
                                class="w-full p-2 border rounded dark:bg-gray-700 dark:text-white" required>
                                <option v-for="c in categories" :key="c.ID" :value="c.ID">
                                    {{ c.Name }}
                                </option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm mb-1">Account</label>
                            <select v-model="form.AccountID"
                                class="w-full p-2 border rounded dark:bg-gray-700 dark:text-white" required>
                                <option v-for="a in accounts" :key="a.ID" :value="a.ID">
                                    {{ a.Name }}
                                </option>
                            </select>
                        </div>
                    </div>

                    <div class="mt-3">
                        <label class="block text-sm mb-1">Amount</label>
                        <input v-model.number="form.Amount" type="number"
                            class="w-full p-2 border rounded dark:bg-gray-700 dark:text-white" required />
                    </div>

                    <div class="mt-6 flex justify-end gap-2">
                        <button type="button" @click="closeForm"
                            class="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500">
                            Cancel
                        </button>
                        <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "@/utils/axios";

// States
const transactions = ref([]);
const categories = ref([]);
const accounts = ref([]);
const showForm = ref(false);

const form = ref({
    ID: null,
    Date: "",
    Type: "expense",
    Description: "",
    CategoryID: null,
    AccountID: null,
    Amount: 0,
});

// Methods
const fetchTransactions = async () => {
    const { data } = await api.get("/api/transactions");
    transactions.value = data.data || [];
};

const fetchCategories = async () => {
    const { data } = await api.get("/api/categories");
    categories.value = data.data || [];
};

const fetchAccounts = async () => {
    const { data } = await api.get("/api/accounts");
    accounts.value = data.data || [];
};

const openForm = (tx = null) => {
    if (tx) {
        form.value = { ...tx, CategoryID: tx.CategoryID, AccountID: tx.AccountID };
    } else {
        form.value = {
            ID: null,
            Date: "",
            Type: "expense",
            Description: "",
            CategoryID: null,
            AccountID: null,
            Amount: 0,
        };
    }
    showForm.value = true;
};

const closeForm = () => {
    showForm.value = false;
};

const saveTransaction = async () => {
    if (form.value.ID) {
        await api.put(`/api/transactions/${form.value.ID}`, form.value);
    } else {
        await api.post("/api/transactions", form.value);
    }
    closeForm();
    fetchTransactions();
};

const deleteTransaction = async (id) => {
    if (confirm("Are you sure you want to delete this transaction?")) {
        await api.delete(`/api/transactions/${id}`);
        fetchTransactions();
    }
};

// Helpers
const formatCurrency = (value) =>
    new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(value);

const formatDate = (date) => new Date(date).toLocaleDateString("id-ID");

// Lifecycle
onMounted(() => {
    fetchTransactions();
    fetchCategories();
    fetchAccounts();
});
</script>
