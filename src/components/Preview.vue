<template>
  <div id="worksheet" class="p-2">
    <svg
        id="svg"
        class="border border-b-blue-600"
        width="100%"
        :height="(amountLines * lineHeight) + Math.ceil(lineHeight / 2)"
    >
      <template v-for="i in amountLines">
        <line
            class="line"
            x1="0"
            :y1="i * lineHeight"
            x2="100%"
            :y2="i * lineHeight"
        ></line>
      </template>

      <template v-for="i in amountDiagonLines">
        <line
            class="diagonal-line"
            :x1="i * 18"
            y1="0"
            :x2="(i * 18) - 14 * amountLines"
            :y2="(amountLines * lineHeight) + Math.ceil(lineHeight / 2)"
        ></line>
      </template>

      <template v-for="(textLine, index) in lines">
        <text
            style="font-family: 'Propisi'"
            x="10"
            :y="lineHeight + (index * lineHeight)"
            :font-size="fontSize"
        >{{ textLine }}</text>
      </template>
    </svg>
  </div>
</template>

<script setup>
import {ref, computed, onMounted } from "vue";
import { useStore } from 'vuex'
import {base64} from "@/fonts/propisi.js";
const store = useStore()

onMounted(() => {
  const styleEl = document.createElement('style');
  const fontFace = `
@font-face {
  font-family: 'Propisi';
  font-style: normal;
  font-weight: 400;
  src: url(data:font/ttf;base64,${base64}) format('truetype');
}`

  styleEl.appendChild(document.createTextNode(
      fontFace
  ));
  document.getElementById('svg').appendChild(styleEl)
})

const lineHeight = ref(35)
const fontSize = 32;
const maxWidth = 560; // Максимальная ширина текста


const lines = computed(() => {
  if (!store.state.text) return []

  const abzacz = store.state.text.split('\n')

  const res = []

  abzacz.forEach((lineText) => {
    const words = lineText.split(' ');
    let currentLine = '';

    words.forEach((word) => {
      let testLine = currentLine + (currentLine ? ' ' : '') + word;
      const width = getTextWidth(testLine);

      if (width > maxWidth && currentLine) {
        console.log({
          word,
          width,
          maxWidth
        })
        res.push(currentLine)
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    })
    res.push(currentLine)
  })
  return res
})

const amountLines = computed(() => {
  return  lines.value.length < 5 ? 5 : lines.value.length
})

const amountDiagonLines = computed(() => {
  const doubleLines = amountLines.value * 4
  const test = Math.ceil(maxWidth / 18)
  return doubleLines > test ? doubleLines : test
})

function getTextWidth(text) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  context.font = `${fontSize}px Propisi`;
  return context.measureText(text).width;
}
</script>

<style scoped>
.line {
  stroke: #000;
  stroke-width: 0.5;
}
.diagonal-line {
  stroke: #b9b2b2;
  stroke-width: 0.5;
}
</style>
