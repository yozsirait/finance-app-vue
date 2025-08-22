<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg w-full max-w-lg">
      <h2 class="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
        {{ form.ID ? "Edit Transaction" : "Add Transaction" }}
      </h2>

      <form @submit.prevent="saveTransaction">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm mb-1">Date</label>
            <input v-model="localForm.Date" type="date"
              class="w-full p-2 border rounded dark:bg-gray-700 dark:text-white" required />
          </div>
          <div>
            <label class="block text-sm mb-1">Type</label>
            <select v-model="localForm.Type"
              class="w-full p-2 border rounded dark:bg-gray-700 dark:text-white" required>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
        </div>

        <div class="mt-3">
          <label class="block text-sm mb-1">Description</label>
          <input v-model="localForm.Description" type="text"
            class="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
            placeholder="e.g. Salary, Shopping..." required />
        </div>

        <div class="mt-3">
          <label class="block text-sm mb-1">Member</label>
          <select v-model="localForm.MemberID" @change="fetchAccounts"
            class="w-full p-2 border rounded dark:bg-gray-700 dark:text-white" required>
            <option value="">-- Select Member --</option>
            <option v-for="m in members" :key="m.ID" :value="m.ID">{{ m.Name }}</option>
          </select>
        </div>

        <div class="mt-3 grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm mb-1">Category</label>
            <select v-model="localForm.CategoryID"
              class="w-full p-2 border rounded dark:bg-gray-700 dark:text-white" required>
              <option value="">-- Select Category --</option>
              <option v-for="c in categories" :key="c.ID" :value="c.ID">{{ c.Name }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm mb-1">Account</label>
            <select v-model="localForm.AccountID"
              class="w-full p-2 border rounded dark:bg-gray-700 dark:text-white" required>
              <option value="">-- Select Account --</option>
              <option v-for="a in accounts" :key="a.ID" :value="a.ID">
                {{ a.Name }} ({{ a.Type }})
              </option>
            </select>
          </div>
        </div>

        <div class="mt-3">
          <CurrencyInput v-model="localForm.Amount" label="Amount (IDR)" />
        </div>

        <div class="mt-6 flex justify-end gap-2">
          <button type="button" @click="$emit('close')"
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
</template>

<script setup>
import { ref, watch } from "vue";
import api from "@/utils/axios";
import CurrencyInput from "@/components/CurrencyInput.vue";

// Props
const props = defineProps({
  form: { type: Object, required: true },
  members: { type: Array, required: true },
  categories: { type: Array, required: true },
});

const emit = defineEmits(["close", "saved"]);

// Local copy of form (biar ga ngedit props langsung)
const localForm = ref({ ...props.form });

// Accounts yang tergantung Member
const accounts = ref([]);

// Fetch accounts by member
const fetchAccounts = async () => {
  accounts.value = [];
  if (!localForm.value.MemberID) return;
  const { data } = await api.get("/api/accounts", {
    params: { member_id: localForm.value.MemberID },
  });
  accounts.value = data.data || [];
};

// Watch biar update form saat edit
watch(
  () => props.form,
  async (newVal) => {
    localForm.value = { ...newVal };
    if (localForm.value.MemberID) {
      await fetchAccounts();
      // pastikan tetap set AccountID sesuai transaction yg diedit
      localForm.value.AccountID = newVal.AccountID;
    }
  },
  { deep: true, immediate: true } // 🔥 immediate penting biar jalan saat edit pertama kali
);

// Save
const saveTransaction = async () => {
  const payload = {
    date: localForm.value.Date,
    type: localForm.value.Type,
    description: localForm.value.Description,
    category_id: localForm.value.CategoryID,
    account_id: localForm.value.AccountID,
    amount: localForm.value.Amount,
    member_id: localForm.value.MemberID,
  };

  if (localForm.value.ID) {
    await api.put(`/api/transactions/${localForm.value.ID}`, payload);
  } else {
    await api.post("/api/transactions", payload);
  }

  emit("saved");
  emit("close");
};
</script>
