<template>
  <div class="flex h-screen bg-gray-100 dark:bg-gray-900">
    <!-- Sidebar -->
    <Sidebar :is-open="sidebarOpen" @toggle="toggleSidebar" />

    <!-- Main Area -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Navbar -->
      <Navbar @toggle-sidebar="toggleSidebar" />

      <!-- Breadcrumb -->
      <Breadcrumb />

      <!-- Content -->
      <main class="flex-1 overflow-y-auto p-6">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import Navbar from "@/components/Navbar.vue";
import Sidebar from "@/components/Sidebar.vue";
import Breadcrumb from "@/components/Breadcrumb.vue";

const sidebarOpen = ref(true);

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value;
};
</script>
