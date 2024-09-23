<!-- eslint-disable no-console -->
<script setup lang="ts">
import { PDF, type PdfTableHeader, pdfAddTable, pdfAddText, pdfAddWatermark } from '@teranes/pdf'
import { getValueByObjectPath, isFunction } from '@teranes/utils'
import { h, ref } from 'vue'

interface Product {
  id: number
  title: string
  price: number
  description: string
  category: string
  image: string
  rating: {
    rate: number
    count: number
  }
}

const headers: PdfTableHeader<Product>[] = [
  {
    text: 'Image',
    component: x => h('img', { src: x.image, style: { height: '36px', objectFit: 'cover' } }),
  },
  {
    text: 'Title',
    value: 'title',
  },
  {
    text: 'Price',
    value: 'price',
  },
  {
    text: 'Description',
    value: 'description',
  },
  {
    text: 'Category',
    value: 'category',
  },
  {
    text: 'Rating',
    value: x => `${x.rating.rate} (${x.rating.count})`,
  },
]

const items = ref<Product[]>([])
getProducts().then((res) => {
  items.value = res
})

async function getProducts(): Promise<Product[]> {
  const response = await fetch('https://fakestoreapi.com/products')
  return response.json()
}

function getValue(item: any, value: any) {
  if (isFunction(value)) {
    return value(item)
  }

  return getValueByObjectPath(item, value)
}

async function print() {
  const pdf = new PDF()

  pdfAddText(pdf, 'Title')

  await pdfAddTable(pdf, headers, items.value, {
    progress: (percentage: number) => {
      console.log(percentage)
    },
  })

  pdfAddWatermark(pdf, 'Vue Composables')

  pdf.print()
}
</script>

<template>
  <div>
    <button @click="print">
      Print
    </button>
    <table>
      <tr>
        <th v-for="header in headers" :key="header.text" v-text="header.text" />
      </tr>
      <tr v-for="item in items" :key="item.id">
        <td v-for="header in headers" :key="header.text">
          <component :is="header.component(item)" v-if="header.component" />
          <template v-else>
            {{ getValue(item, header.value) }}
          </template>
        </td>
      </tr>
    </table>
  </div>
</template>

<style>
.test{
  color: red;
}
</style>
