<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
    <div class="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-2xl shadow">
      <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">Register</h1>

      <form @submit.prevent="handleRegister" class="space-y-4">
        <div>
          <label class="block text-sm text-gray-600 dark:text-gray-300 mb-1">Name</label>
          <input
            v-model="name"
            type="text"
            required
            class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label class="block text-sm text-gray-600 dark:text-gray-300 mb-1">Email</label>
          <input
            v-model="email"
            type="email"
            required
            class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label class="block text-sm text-gray-600 dark:text-gray-300 mb-1">Password</label>
          <input
            v-model="password"
            type="password"
            required
            class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          class="w-full py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold transition"
        >
          Register
        </button>
      </form>

      <p v-if="errorMessage" class="mt-4 text-red-500 text-sm">{{ errorMessage }}</p>

      <p class="mt-6 text-sm text-gray-600 dark:text-gray-300">
        Already have an account?
        <router-link to="/login" class="text-blue-600 hover:underline">Login</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/store/auth";

const name = ref("");
const email = ref("");
const password = ref("");
const errorMessage = ref("");
const auth = useAuthStore();
const router = useRouter();

const handleRegister = async () => {
  const success = await auth.register(name.value, email.value, password.value);
  if (success) {
    router.push("/dashboard");
  } else {
    errorMessage.value = "Failed to register, please try again.";
  }
};
</script>
