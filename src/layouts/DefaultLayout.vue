<template>
  <div class="flex h-screen bg-gray-100 dark:bg-gray-900">
    <!-- Sidebar -->
    <Sidebar :is-open="sidebarOpen" @toggle="sidebarOpen = !sidebarOpen" />

    <!-- Main -->
    <div class="flex flex-col flex-1">
      <Navbar @toggleSidebar="sidebarOpen = !sidebarOpen" />
      <main class="p-4 overflow-y-auto flex-1">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import Sidebar from "@/components/Sidebar.vue";
import Navbar from "@/components/Navbar.vue";

const sidebarOpen = ref(true);
</script>
