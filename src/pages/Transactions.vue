<template>
    <div>
        <!-- Header + Filter -->
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100">
                Transactions
            </h1>
            <div class="flex flex-wrap gap-2 items-center">
                <!-- Member Filter -->
                <select v-model="filters.member_id" @change="fetchTransactions"
                    class="p-2 border rounded dark:bg-gray-700 dark:text-white">
                    <option value="">All Members</option>
                    <option v-for="m in members" :key="m.ID" :value="m.ID">{{ m.Name }}</option>
                </select>

                <!-- Category Filter -->
                <select v-model="filters.category_id" @change="fetchTransactions"
                    class="p-2 border rounded dark:bg-gray-700 dark:text-white">
                    <option value="">All Categories</option>
                    <option v-for="c in categories" :key="c.ID" :value="c.ID">{{ c.Name }}</option>
                </select>

                <!-- Type Filter -->
                <select v-model="filters.type" @change="fetchTransactions"
                    class="p-2 border rounded dark:bg-gray-700 dark:text-white">
                    <option value="">All Types</option>
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                </select>

                <!-- Date Range -->
                <input type="date" v-model="filters.start_date" @change="fetchTransactions"
                    class="p-2 border rounded dark:bg-gray-700 dark:text-white" />
                <input type="date" v-model="filters.end_date" @change="fetchTransactions"
                    class="p-2 border rounded dark:bg-gray-700 dark:text-white" />

                <!-- Reset Button -->
                <button @click="resetFilters" class="px-3 py-2 bg-gray-400 text-white rounded hover:bg-gray-500">
                    Reset
                </button>
            </div>

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

        <!-- Modal Form (sama seperti sebelumnya) -->
        <TransactionForm v-if="showForm" :form="form" :members="members" :categories="categories" @close="closeForm"
            @saved="fetchTransactions" />
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "@/utils/axios";
import TransactionForm from "@/components/TransactionForm.vue"; // form yg tadi kamu udah punya

// States
const transactions = ref([]);
const categories = ref([]);
const members = ref([]);
const showForm = ref(false);

const form = ref({});
const filters = ref({
    member_id: "",
    category_id: "",
    type: "",
    start_date: "",
    end_date: "",
});

// Methods
const fetchTransactions = async () => {
    const { data } = await api.get("/api/transactions", { params: filters.value });
    transactions.value = data.data || [];
};

const fetchCategories = async () => {
    const { data } = await api.get("/api/categories");
    categories.value = data.data || [];
};

const fetchMembers = async () => {
    const { data } = await api.get("/api/members");
    members.value = data.data || [];
};

const openForm = (tx = null) => {
    if (tx) {
        form.value = {
            ...tx,
            CategoryID: tx.CategoryID,
            AccountID: tx.AccountID,
            MemberID: tx.MemberID,
            // mapping relasi agar tetap bisa dipakai di form
            AccountType: tx.Account?.Type || null,
        };
    } else {
        form.value = {
            ID: null,
            Date: "",
            Type: "expense",
            Description: "",
            CategoryID: null,
            AccountID: null,
            MemberID: null,
            AccountType: null,
            Amount: 0,
        };
    }
    showForm.value = true;
};
const closeForm = () => (showForm.value = false);

const deleteTransaction = async (id) => {
    if (confirm("Are you sure you want to delete this transaction?")) {
        await api.delete(`/api/transactions/${id}`);
        fetchTransactions();
    }
};

const resetFilters = () => {
    filters.value = {
        member_id: "",
        category_id: "",
        type: "",
        start_date: "",
        end_date: "",
    };
    fetchTransactions();
};

// Helpers
const formatCurrency = (value) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(value);

const formatDate = (date) => new Date(date).toLocaleDateString("id-ID");

// Lifecycle
onMounted(() => {
    fetchTransactions();
    fetchCategories();
    fetchMembers();
});

</script>
