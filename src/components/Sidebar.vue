<template>
  <aside :class="[
    'h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-all duration-300',
    isOpen ? 'w-64' : 'w-20'
  ]">
    <!-- Logo -->
    <div class="flex items-center justify-between p-4">
      <h1 class="text-xl font-bold text-gray-800 dark:text-gray-100">
        {{ isOpen ? 'Finance' : 'FIN' }}
      </h1>
      <!-- <button
        @click="$emit('toggle')"
        class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        <Menu class="w-6 h-6 text-gray-600 dark:text-gray-300" />
      </button> -->
    </div>

    <!-- Navigation -->
    <nav class="flex-1 overflow-y-auto px-2">
      <ul class="space-y-1">
        <li v-for="(item, idx) in menu" :key="idx">
          <router-link v-if="!item.children" :to="item.to"
            class="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200">
            <component :is="item.icon" class="w-5 h-5" />
            <span v-if="isOpen">{{ item.label }}</span>
          </router-link>

          <!-- Submenu -->
          <div v-else>
            <button @click="toggleDropdown(idx)"
              class="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200">
              <component :is="item.icon" class="w-5 h-5" />
              <span v-if="isOpen">{{ item.label }}</span>
              <ChevronDown v-if="isOpen"
                :class="['ml-auto transition-transform', openIndex === idx ? 'rotate-180' : '']" />
            </button>
            <ul v-if="isOpen && openIndex === idx" class="pl-8 mt-1 space-y-1">
              <li v-for="(child, cidx) in item.children" :key="cidx">
                <router-link :to="child.to"
                  class="block p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300">
                  {{ child.label }}
                </router-link>
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </nav>

    <!-- Dark Mode Toggle -->
    <div class="p-4 border-t border-gray-200 dark:border-gray-700">
      <button @click="toggleDarkMode"
        class="flex items-center gap-3 p-2 w-full rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200">
        <Moon v-if="!isDark" class="w-5 h-5" />
        <Sun v-else class="w-5 h-5" />
        <span v-if="isOpen">{{ isDark ? 'Light Mode' : 'Dark Mode' }}</span>
      </button>
    </div>
  </aside>
</template>

<script setup>
import { ref, computed } from "vue";
import { useDark, useToggle } from "@vueuse/core";
import {
  Menu,
  ChevronDown,
  LayoutDashboard,
  Users,
  Wallet,
  FolderTree,
  //   ArrowsLeftRight,
  Target,
  BarChart3,
  User,
  Moon,
  Sun
} from "lucide-vue-next";
import { sidebarMenu } from "@/utils/sidebarMenu";

defineProps({
  isOpen: { type: Boolean, default: true },
});

const openIndex = ref(null);
const toggleDropdown = (idx) => {
  openIndex.value = openIndex.value === idx ? null : idx;
};

// dark mode
const isDark = useDark();
const toggleDarkMode = useToggle(isDark);

const menu = computed(() => sidebarMenu);
</script>
