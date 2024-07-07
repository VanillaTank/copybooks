<template>
  <div class="container border border-amber-900">
    <Settings />

    <div
        class="flex justify-between"
        style="min-height: 430px"
    >
      <TextInput
          style="width: 50%;"
          class="border border-b-green-200 h-full"/>
      <div
          class="border border-lime-800"
          style="width: 50%;"
      >
        <button
            class="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
            @click="loadPdf"
        >Скачать PDF</button>
        <Preview id="worksheet"/>
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



function loadPdf () {
  const pdf = new jsPDF();
  const element = document.getElementById('worksheet');

  html2canvas(element).then(canvas => {
    const imgData = canvas.toDataURL('image/png');
    const imgWidth = 210; // Ширина PDF страницы в мм (A4 размер)
    const pageHeight = 295; // Высота PDF страницы в мм (A4 размер)
    const imgHeight = canvas.height * imgWidth / canvas.width;
    let heightLeft = imgHeight;

    const maxPageHeight = 35 * 22 / 3.8

    let position = 0;
    while (heightLeft > 0) {
      if (position) {
        pdf.addPage();
      }
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, null, 'NONE');
      heightLeft -= pageHeight;
      position = heightLeft - imgHeight;
    }

    pdf.save('прописи.pdf');
  })
}
</script>
