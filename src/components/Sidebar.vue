<template>
  <aside :class="[
    'h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-all duration-300',
    isOpen ? 'w-54' : 'w-15'
  ]">
    <!-- Logo -->
    <div class="flex items-center justify-between p-4">
      <h1 class="text-xl font-bold text-gray-800 dark:text-gray-100">
        {{ isOpen ? 'Finance App' : 'FIN' }}
      </h1>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 overflow-y-auto px-2">
      <ul class="space-y-1">
        <template v-for="(item, idx) in menu" :key="idx">
          <!-- Expanded Mode -->
          <template v-if="isOpen">
            <li v-if="!item.children">
              <router-link :to="item.to"
                class="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200">
                <component :is="item.icon" class="w-5 h-5" />
                <span>{{ item.label }}</span>
              </router-link>
            </li>
            <li v-else>
              <div>
                <button @click="toggleDropdown(idx)"
                  class="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200">
                  <component :is="item.icon" class="w-5 h-5" />
                  <span>{{ item.label }}</span>
                  <ChevronDown :class="['ml-auto transition-transform', openIndex === idx ? 'rotate-180' : '']" />
                </button>
                <ul v-if="openIndex === idx" class="pl-8 mt-1 space-y-1">
                  <li v-for="(child, cidx) in item.children" :key="cidx">
                    <router-link :to="child.to"
                      class="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300">
                      <component :is="child.icon" class="w-4 h-4" />
                      <span>{{ child.label }}</span>
                    </router-link>
                  </li>
                </ul>
              </div>
            </li>
          </template>

          <!-- Collapsed Mode - Show only children -->
          <template v-else-if="item.children">
            <li v-for="(child, cidx) in item.children" :key="'child-' + cidx">
              <router-link :to="child.to"
                class="flex items-center justify-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300">
                <component :is="child.icon" class="w-5 h-5" />
                <!-- Optional: Tooltip untuk label saat collapsed -->
                <span class="sr-only">{{ child.label }}</span>
              </router-link>
            </li>
          </template>

          <!-- Collapsed Mode - Single items -->
          <template v-else>
            <li>
              <router-link :to="item.to"
                class="flex items-center justify-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300">
                <component :is="item.icon" class="w-5 h-5" />
                <span class="sr-only">{{ item.label }}</span>
              </router-link>
            </li>
          </template>
        </template>
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
import { Menu, ChevronDown, Moon, Sun } from "lucide-vue-next";
import { sidebarMenu } from "@/utils/sidebarMenu";

const props = defineProps({
  isOpen: { type: Boolean, default: true }
});

const openIndex = ref(null);
const toggleDropdown = (idx) => {
  openIndex.value = openIndex.value === idx ? null : idx;
};

const isDark = useDark();
const toggleDarkMode = useToggle(isDark);

const menu = computed(() => sidebarMenu);
</script>
