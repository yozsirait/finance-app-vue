<template>
  <div class="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4">
    <div class="w-full max-w-md p-8 bg-white/10 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl">
      <h1 class="text-3xl font-bold text-center text-white mb-6">Login</h1>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="block text-sm text-gray-300 mb-1">Email</label>
          <input
            v-model="email"
            type="email"
            required
            class="w-full px-4 py-2 rounded-lg border border-gray-600 bg-gray-900/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label class="block text-sm text-gray-300 mb-1">Password</label>
          <input
            v-model="password"
            type="password"
            required
            class="w-full px-4 py-2 rounded-lg border border-gray-600 bg-gray-900/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          class="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
        >
          Login
        </button>
      </form>

      <p v-if="errorMessage" class="mt-4 text-red-400 text-sm text-center">{{ errorMessage }}</p>

      <p class="mt-6 text-sm text-center text-gray-400">
        Don’t have an account?
        <router-link to="/register" class="text-blue-400 hover:underline">Sign Up</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/store/auth";

const email = ref("");
const password = ref("");
const errorMessage = ref("");
const auth = useAuthStore();
const router = useRouter();

const handleLogin = async () => {
  const success = await auth.login(email.value, password.value);
  if (success) {
    router.push("/dashboard");
  } else {
    errorMessage.value = "Invalid email or password";
  }
};
</script>
