<template>
  <div>
    <label v-if="label" class="block mb-1 font-medium">{{ label }}</label>
    <input
      type="text"
      :value="displayValue"
      @input="onInput"
      class="form-control w-full rounded border px-3 py-2 focus:ring focus:ring-blue-400"
      placeholder="Rp0"
    />
  </div>
</template>

<script setup>
import { ref, watch, computed } from "vue";

const props = defineProps({
  modelValue: {
    type: Number,
    default: 0,
  },
  label: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:modelValue"]);

const displayValue = ref("");

// format ke IDR
const formatIDR = (value) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value || 0);

// watch nilai dari parent
watch(
  () => props.modelValue,
  (newVal) => {
    displayValue.value = formatIDR(newVal);
  },
  { immediate: true }
);

// handle input user
const onInput = (event) => {
  const raw = event.target.value.replace(/[^\d]/g, ""); // hanya angka
  const numericValue = parseInt(raw || "0", 10);

  // update ke parent (angka mentah)
  emit("update:modelValue", numericValue);

  // update tampilan (format IDR)
  displayValue.value = formatIDR(numericValue);
};
</script>
