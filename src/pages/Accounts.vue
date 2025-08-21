<template>
    <div class="space-y-6">
        <!-- Header -->
        <div class="flex justify-between items-center">
            <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100">Accounts</h1>
            <button @click="showAddModal = true"
                class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                <Plus class="w-5 h-5" />
                Add Account
            </button>
        </div>

        <!-- Toast -->
        <transition name="fade">
            <div v-if="toastMessage" class="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
                <div :class="['px-6 py-3 rounded-lg shadow-lg text-white',
                    toastType === 'success' ? 'bg-green-600' : 'bg-red-600']">
                    {{ toastMessage }}
                </div>
            </div>
        </transition>

        <!-- Loading -->
        <div v-if="loading" class="flex justify-center items-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>

        <!-- Table -->
        <div v-if="!loading && accounts.length > 0"
            class="bg-white dark:bg-gray-800 rounded-2xl shadow overflow-hidden">
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead class="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th
                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                                Name</th>
                            <th
                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                                Type</th>
                            <th
                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                                Balance</th>
                            <th
                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                                Currency</th>
                            <th
                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                                Created At</th>
                            <th
                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                                Updated At</th>
                            <th
                                class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                                Actions</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        <tr v-for="acc in accounts" :key="acc.ID">
                            <td class="px-6 py-4">{{ acc.Name }}</td>
                            <td class="px-6 py-4">{{ acc.Type }}</td>
                            <td class="px-6 py-4">{{ formatCurrency(acc.Balance) }}</td>
                            <td class="px-6 py-4">{{ acc.Currency }}</td>
                            <td class="px-6 py-4">{{ formatDate(acc.CreatedAt) }}</td>
                            <td class="px-6 py-4">{{ formatDate(acc.UpdatedAt) }}</td>
                            <td class="px-6 py-4 text-right">
                                <button @click="openEditModal(acc)"
                                    class="text-blue-600 hover:text-blue-900 dark:text-blue-400 mr-4">Edit</button>
                                <button @click="confirmDelete(acc)"
                                    class="text-red-600 hover:text-red-900 dark:text-red-400">Delete</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Empty State -->
        <div v-if="!loading && accounts.length === 0" class="text-center py-12">
            <Users class="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No accounts yet</h3>
            <p class="text-gray-500 dark:text-gray-400 mb-4">Add your first account to get started.</p>
            <button @click="showAddModal = true"
                class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg">Add Account</button>
        </div>

        <!-- Add/Edit Modal -->
        <Modal :show="showAddModal || showEditModal" @close="closeModal">
            <div class="p-6">
                <h2 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                    {{ isEditing ? "Edit Account" : "Add New Account" }}
                </h2>
                <form @submit.prevent="isEditing ? updateAccount() : createAccount()">
                    <div class="mb-4">
                        <label class="block text-sm font-medium mb-2">Name *</label>
                        <input v-model="form.Name" required
                            class="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white" />
                    </div>
                    <div class="mb-4">
                        <label class="block text-sm font-medium mb-2">Type *</label>
                        <select v-model="form.Type" required
                            class="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white">
                            <option value="Bank">Bank</option>
                            <option value="e-Wallet">e-Wallet</option>
                            <option value="Cash">Cash</option>
                        </select>
                    </div>

                    <CurrencyInput v-model="form.Balance" label="Balance (IDR)" />

                    <div class="mb-4">
                        <label class="block text-sm font-medium mb-2">Currency</label>
                        <input v-model="form.Currency" placeholder="IDR"
                            class="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white" />
                    </div>

                    <!-- 🔹 Select Member -->
                    <div class="mb-4">
                        <label class="block text-sm font-medium mb-2">Member *</label>
                        <select v-model="form.MemberID" required
                            class="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white">
                            <option disabled value="">Select Member</option>
                            <option v-for="m in members" :key="m.ID" :value="m.ID">
                                {{ m.Name }}
                            </option>
                        </select>
                    </div>

                    <div class="flex justify-end gap-3">
                        <button type="button" @click="closeModal"
                            class="px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded-md">
                            Cancel
                        </button>
                        <button type="submit" :disabled="loadingForm"
                            class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50">
                            {{ loadingForm ? "Saving..." : isEditing ? "Update" : "Create" }}
                        </button>
                    </div>
                </form>
            </div>
        </Modal>

        <!-- Delete Modal -->
        <Modal :show="showDeleteModal" @close="showDeleteModal = false">
            <div class="p-6">
                <h2 class="text-lg font-medium mb-4">Confirm Delete</h2>
                <p class="mb-6">Are you sure you want to delete account
                    <strong>{{ accountToDelete?.Name }}</strong>?
                </p>
                <div class="flex justify-end gap-3">
                    <button @click="showDeleteModal = false"
                        class="px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded-md">Cancel</button>
                    <button @click="deleteAccount" :disabled="loadingDelete"
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
import CurrencyInput from "@/components/CurrencyInput.vue";
import api from "@/utils/axios";

// state
const users = ref([]);
const accounts = ref([]);
const members = ref([]);
const loading = ref(false);
const loadingMembers = ref(false);
const error = ref("");
const showAddModal = ref(false);
const showEditModal = ref(false);
const showDeleteModal = ref(false);
const loadingForm = ref(false);
const loadingDelete = ref(false);
const isEditing = ref(false);
const accountToDelete = ref(null);

const toastMessage = ref("");
const toastType = ref("success");

const form = ref({
    ID: null,
    Name: "",
    Type: "Bank",
    Balance: 0,
    Currency: "IDR",
    MemberID: null,
});

// toast
const showToast = (msg, type = "success") => {
    toastMessage.value = msg;
    toastType.value = type;
    setTimeout(() => {
        toastMessage.value = "";
    }, 3000);
};

// fetch accounts
const fetchAccounts = async () => {
    try {
        loading.value = true;
        const { data } = await api.get("/api/accounts");
        if (data.success) accounts.value = data.data;
    } catch (err) {
        error.value = err.response?.data?.message || err.message;
        showToast(error.value, "error");
    } finally {
        loading.value = false;
    }
};

// fetch members
const fetchMembers = async () => {
    try {
        loadingMembers.value = true;
        const userId = localStorage.getItem("user_id");
        const { data } = await api.get(`/api/members?user_id=${userId}`);

        if (data.success) {
            members.value = data.data;
        }

    } catch (err) {
        showToast(err.response?.data?.message || err.message, "error");
    } finally {
        loadingMembers.value = false;
    }
};


// create
const createAccount = async () => {
    try {
        loadingForm.value = true;
        const payload = {
            member_id: form.value.MemberID,
            name: form.value.Name,
            type: form.value.Type,
            balance: form.value.Balance,
            currency: form.value.Currency || "IDR",
        };
        const { data } = await api.post("/api/accounts", payload);
        if (data.success) {
            accounts.value.push(data.data);
            closeModal();
            showToast("Account created successfully!");
        }
    } catch (err) {
        showToast(err.response?.data?.message || err.message, "error");
    } finally {
        loadingForm.value = false;
    }
};

// update
const updateAccount = async () => {
    try {
        loadingForm.value = true;
        const payload = {
            member_id: form.value.MemberID,
            name: form.value.Name,
            type: form.value.Type,
            balance: form.value.Balance,
            currency: form.value.Currency,
        };
        const { data } = await api.put(`/api/accounts/${form.value.ID}`, payload);
        if (data.success) {
            const idx = accounts.value.findIndex((a) => a.ID === form.value.ID);
            if (idx !== -1) accounts.value[idx] = data.data;
            closeModal();
            showToast("Account updated successfully!");
        }
    } catch (err) {
        showToast(err.response?.data?.message || err.message, "error");
    } finally {
        loadingForm.value = false;
    }
};

// delete
const deleteAccount = async () => {
    try {
        loadingDelete.value = true;
        const { data } = await api.delete(`/api/accounts/${accountToDelete.value.ID}`);
        if (data.success) {
            accounts.value = accounts.value.filter((a) => a.ID !== accountToDelete.value.ID);
            showDeleteModal.value = false;
            showToast("Account deleted successfully!");
        }
    } catch (err) {
        showToast(err.response?.data?.message || err.message, "error");
    } finally {
        loadingDelete.value = false;
    }
};

// modal
const openEditModal = (acc) => {
    isEditing.value = true;
    form.value = { ...acc, MemberID: acc.MemberID };
    showEditModal.value = true;
};
const confirmDelete = (acc) => {
    accountToDelete.value = acc;
    showDeleteModal.value = true;
};
const closeModal = () => {
    showAddModal.value = false;
    showEditModal.value = false;
    isEditing.value = false;
    form.value = { ID: null, Name: "", Type: "Bank", Balance: 0, Currency: "IDR", MemberID: null };
};

// helpers
const formatDate = (date) => new Date(date).toLocaleString("id-ID");
const formatCurrency = (num) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(num);

onMounted(() => {
    fetchAccounts();
    fetchMembers();
});
</script>