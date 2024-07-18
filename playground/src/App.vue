<!-- eslint-disable no-console -->
<script setup lang="ts">
import Print from './components/Print.vue'

console.log(useToCurrencyString(1000))
console.log(useDate())

const printComponent = ref<ComponentType<typeof Print>>()

async function print() {
  if (printComponent.value) {
    const pdf = new PDF()

    usePdfAddText(pdf, 'Title', { fontSize: 18 })

    await usePdfAddComponent(pdf, Print, {
      y: 10,
      debounceDelay: 1000,
    })

    usePdfAddText(pdf, 'Title', { y: 10, fontSize: 18 })

    usePdfAddText(pdf, 'Title', { y: 10, fontSize: 18 })

    usePdfAddWatermark(pdf, 'Vue Composables')

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
</style>import { title } from 'process';
import { PDF, pdfAddText, pdfAddTable, pdfAddWatermark } from '../../dist';
import { title } from 'process';
import { PDF, pdfAddText, pdfAddTable, pdfAddWatermark } from '../../dist';import { title } from 'process';
import { PDF, pdfAddText, pdfAddTable, pdfAddWatermark } from '../../dist';import { title } from 'process';
import { pdfAddText, pdfAddTable, pdfAddWatermark } from '../../dist';import { title } from 'process';
import { pdfAddText, pdfAddTable, pdfAddWatermark } from '../../dist';import { title } from 'process';
import { pdfAddText, pdfAddTable, pdfAddWatermark } from '../../dist';import { title } from 'process';
import { pdfAddText, pdfAddTable, pdfAddWatermark } from '../../dist';
