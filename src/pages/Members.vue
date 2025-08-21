<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100">Members</h1>
      <button @click="showAddModal = true"
        class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
        <Plus class="w-5 h-5" />
        Add Member
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
      {{ error }}
    </div>

    <!-- Members Table -->
    <div v-if="!loading && members.length > 0" class="bg-white dark:bg-gray-800 rounded-2xl shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Name
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Created At
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Updated At
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="member in members" :key="member.ID">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ member.Name }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-500 dark:text-gray-400">{{ formatDate(member.CreatedAt) }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-500 dark:text-gray-400">{{ formatDate(member.UpdatedAt) }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button @click="openEditModal(member)"
                  class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-4">
                  Edit
                </button>
                <button @click="confirmDelete(member)"
                  class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="!loading && members.length === 0" class="text-center py-12">
      <Users class="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No members yet</h3>
      <p class="text-gray-500 dark:text-gray-400 mb-4">Get started by adding your first member.</p>
      <button @click="showAddModal = true" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg">
        Add Member
      </button>
    </div>

    <!-- Add/Edit Modal -->
    <Modal :show="showAddModal || showEditModal" @close="closeModal">
      <div class="p-6">
        <h2 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
          {{ isEditing ? 'Edit Member' : 'Add New Member' }}
        </h2>
        <form @submit.prevent="isEditing ? updateMember() : createMember()">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Name *
            </label>
            <input v-model="form.Name" type="text" required
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Enter member name">
          </div>
          <div class="flex justify-end gap-3">
            <button type="button" @click="closeModal"
              class="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500">
              Cancel
            </button>
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
          Are you sure you want to delete member <strong>{{ memberToDelete?.Name }}</strong>? This action cannot be undone.
        </p>
        <div class="flex justify-end gap-3">
          <button @click="showDeleteModal = false"
            class="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500">
            Cancel
          </button>
          <button @click="deleteMember" :disabled="loadingDelete"
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

const members = ref([]);
const loading = ref(false);
const error = ref("");
const showAddModal = ref(false);
const showEditModal = ref(false);
const showDeleteModal = ref(false);
const loadingForm = ref(false);
const loadingDelete = ref(false);
const isEditing = ref(false);
const memberToDelete = ref(null);

const form = ref({
  ID: null,
  Name: ""
});

// Fetch members
const fetchMembers = async () => {
  try {
    loading.value = true;
    error.value = "";
    const { data } = await api.get("/api/members");
    if (data.success) {
      members.value = data.data;
    }
  } catch (err) {
    error.value = "Failed to load members: " + (err.response?.data?.message || err.message);
    console.error("Failed to load members:", err);
  } finally {
    loading.value = false;
  }
};

// Create member
const createMember = async () => {
  try {
    loadingForm.value = true;
    const { data } = await api.post("/api/members", {
      Name: form.value.Name
    });
    
    if (data.success) {
      members.value.push(data.data);
      closeModal();
    }
  } catch (err) {
    error.value = "Failed to create member: " + (err.response?.data?.message || err.message);
    console.error("Failed to create member:", err);
  } finally {
    loadingForm.value = false;
  }
};

// Update member
const updateMember = async () => {
  try {
    loadingForm.value = true;
    const { data } = await api.put(`/api/members/${form.value.ID}`, {
      Name: form.value.Name
    });
    
    if (data.success) {
      const index = members.value.findIndex(m => m.ID === form.value.ID);
      if (index !== -1) {
        members.value[index] = data.data;
      }
      closeModal();
    }
  } catch (err) {
    error.value = "Failed to update member: " + (err.response?.data?.message || err.message);
    console.error("Failed to update member:", err);
  } finally {
    loadingForm.value = false;
  }
};

// Delete member
const deleteMember = async () => {
  try {
    loadingDelete.value = true;
    const { data } = await api.delete(`/api/members/${memberToDelete.value.ID}`);
    
    if (data.success) {
      members.value = members.value.filter(m => m.ID !== memberToDelete.value.ID);
      showDeleteModal.value = false;
    }
  } catch (err) {
    error.value = "Failed to delete member: " + (err.response?.data?.message || err.message);
    console.error("Failed to delete member:", err);
  } finally {
    loadingDelete.value = false;
  }
};

// Open edit modal
const openEditModal = (member) => {
  isEditing.value = true;
  form.value = {
    ID: member.ID,
    Name: member.Name
  };
  showEditModal.value = true;
};

// Confirm delete
const confirmDelete = (member) => {
  memberToDelete.value = member;
  showDeleteModal.value = true;
};

// Close modal
const closeModal = () => {
  showAddModal.value = false;
  showEditModal.value = false;
  isEditing.value = false;
  form.value = {
    ID: null,
    Name: ""
  };
};

// Format date
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

onMounted(() => {
  fetchMembers();
});
</script>