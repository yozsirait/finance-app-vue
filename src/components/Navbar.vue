<template>
  <header class="flex items-center justify-between px-4 py-2 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
    <!-- Left: Toggle Sidebar -->
    <button
      @click="$emit('toggle-sidebar')"
      class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
    >
      <Menu class="w-6 h-6 text-gray-600 dark:text-gray-300" />
    </button>

    <!-- Middle: Search -->
    <div class="flex-1 px-4 max-w-md">
      <div class="relative">
        <Search class="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search..."
          class="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>

    <!-- Right: User Menu -->
    <div class="flex items-center gap-4">
      <button class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
        <Bell class="w-6 h-6 text-gray-600 dark:text-gray-300" />
      </button>
      <div class="relative" @click="toggleProfile">
        <img
          src="https://i.pravatar.cc/40"
          alt="avatar"
          class="w-9 h-9 rounded-full cursor-pointer border border-gray-300 dark:border-gray-600"
        />
        <transition name="fade">
          <div
            v-if="showProfile"
            class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-2 z-50"
          >
            <router-link
              to="/profile"
              class="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              My Account
            </router-link>
          </div>
        </transition>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from "vue";
import { Menu, Search, Bell } from "lucide-vue-next";

const showProfile = ref(false);
const toggleProfile = () => {
  showProfile.value = !showProfile.value;
};
</script>
