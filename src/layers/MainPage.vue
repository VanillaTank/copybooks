<template>
  <div class="container border border-amber-900">
    <Settings />

    <input type="file" @change="base64convert">

    <div
        class="flex justify-between"
        style="min-height: 430px"
    >
      <TextInput
          style="width: 45%;"
          class="border border-b-green-200 h-full"/>
      <div
          class="border border-lime-800"
          style="width: 55%;"
      >
        <button
            class="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
            @click="loadPdf"
        >Скачать PDF</button>
        <Preview />
      </div>
    </div>
  </div>
</template>

<script setup>
import Settings from '../components/Settings.vue'
import Preview from '../components/Preview.vue'
import TextInput from '../components/TextInput.vue'

import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import {computed} from "vue";
import store from "@/store.js";

function base64convert (event) {
  const files = event.target.files
  console.clear()
  const reader = new FileReader()
  reader.onload = (e) => {
    console.log(e.target.result)
  }
  reader.readAsDataURL(files[0])
}

const pageAmount = computed(() => store.state.pageAmount)

function loadPdf () {
  const pdf = new jsPDF();
  const getPages = () => {
    const res = []
    for (let i = 1; i <= pageAmount.value; i += 1) {
      res.push(document.getElementById(`worksheet-${i}`))
    }
    return res
  }

  Promise.all(getPages().map((element, index) => {
    return  html2canvas(element).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 210; // Ширина PDF страницы в мм (A4 размер)
      const imgHeight = canvas.height * imgWidth / canvas.width;

      if(index) {
        pdf.addPage()
      }
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight, null, 'NONE');
    })
  }))
      .then(() => {
        pdf.save('прописи.pdf');
      })
}
</script>
