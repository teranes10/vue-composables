<!-- eslint-disable no-console -->
<script setup lang="ts">
import { type ComponentType, PDF, date, pdfAddComponent, pdfAddText, pdfAddWatermark, toCurrencyString } from '@teranes/vue-composables'
import { ref } from 'vue'
import Print from './components/Print.vue'

console.log(toCurrencyString(1000))
console.log(date())

const printComponent = ref<ComponentType<typeof Print>>()

async function print() {
  if (printComponent.value) {
    const pdf = new PDF()

    pdfAddText(pdf, 'Title', { fontSize: 18 })

    await pdfAddComponent(pdf, Print, {
      y: 10,
      debounceDelay: 1000,
    })

    pdfAddText(pdf, 'Title', { y: 10, fontSize: 18 })

    pdfAddText(pdf, 'Title', { y: 10, fontSize: 18 })

    pdfAddWatermark(pdf, 'Vue Composables')

    pdf.print()
  }
}
</script>

<template>
  <button @click="print">
    element print
  </button>
  <Print ref="printComponent" />
</template>

<style>
button {
  height: 40px;
  font-size: 14px;
  font-weight: 500;
  background: red;
  color: white;
  border-radius: 0.25rem;
}
</style>
