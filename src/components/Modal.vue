<template>
  <Transition enter-active-class="transition ease-out duration-200" enter-from-class="opacity-0" enter-to-class="opacity-100"
    leave-active-class="transition ease-in duration-150" leave-from-class="opacity-100" leave-to-class="opacity-0">
    <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" @click="$emit('close')">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md" @click.stop>
        <slot></slot>
      </div>
    </div>
  </Transition>
</template>

<script setup>
defineProps({
  show: Boolean
});

defineEmits(['close']);
</script>