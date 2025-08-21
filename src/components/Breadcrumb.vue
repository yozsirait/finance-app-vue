<!-- src/components/Breadcrumb.vue -->
<template>
  <nav class="flex px-6 py-3 text-sm text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 shadow">
    <ol class="flex items-center space-x-2">
      <li>
        <router-link to="/dashboard" class="hover:text-blue-600">Finance App</router-link>
      </li>

      <li v-for="(c, idx) in crumbs" :key="c.path" class="flex items-center">
        <span class="mx-1">/</span>

        <!-- Last item = current page -->
        <span v-if="idx === crumbs.length - 1" class="font-semibold text-gray-900 dark:text-gray-100">
          {{ c.label }}
        </span>

        <!-- Intermediate links -->
        <router-link v-else :to="c.path" class="hover:text-blue-600">
          {{ c.label }}
        </router-link>
      </li>
    </ol>
  </nav>
</template>

<script setup>
import { useRoute } from "vue-router";
import { computed } from "vue";

const route = useRoute();

/**
 * Ambil hanya matched routes yang punya meta.breadcrumb,
 * buang parent layout (yang biasanya tanpa breadcrumb),
 * dan normalisasi path agar pasti diawali '/'.
 */
const crumbs = computed(() =>
  route.matched
    .filter(r => r.meta && r.meta.breadcrumb)
    .map(r => ({
      label: r.meta.breadcrumb,
      path: r.path.startsWith("/") ? r.path : `/${r.path}`,
    }))
);
</script>
