<template>
  <div
      v-for="(textLinesPerPage, index) in textLinesPerPages"
      :id="`worksheet-${index+1}`"
      class="p-2"
  >
    <svg
        :id="`svg-${index}`"
        class="border mb-2"
        width="100%"
        :height="(TEXT_LINES_PER_PAGE * lineHeight + Math.ceil(lineHeight / 2)) + 10"
    >
      <template v-for="i in TEXT_LINES_PER_PAGE">
        <line
            class="line"
            x1="0"
            :y1="i * lineHeight + 5"
            x2="100%"
            :y2="i * lineHeight + 5"
        ></line>
      </template>

      <template v-for="i in amountDiagonLines">
        <line
            class="diagonal-line"
            :x1="i * 18"
            y1="5"
            :x2="(i * 18) - 14 * TEXT_LINES_PER_PAGE"
            :y2="(TEXT_LINES_PER_PAGE * lineHeight) + Math.ceil(lineHeight / 2)"
        ></line>
      </template>

      <template v-if="isShowText">
        <template v-for="(textLine, index) in textLinesPerPage">
          <text
              style="font-family: 'Propisi'"
              x="10"
              :y="(lineHeight + (index * lineHeight)) + 5"
              :font-size="fontSize"
          >{{ textLine }}
          </text>
        </template>
      </template>
<!--      <foreignObject-->
<!--          x="10"-->
<!--          :y="15"-->
<!--          :width="maxWidth"-->
<!--          height="100%"-->
<!--          requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility">-->
<!--        <div-->
<!--            xmlns="http://www.w3.org/1999/xhtml"-->
<!--            style="font-family: 'Propisi';font-size:32px;line-height: 35px;"-->
<!--        >-->
<!--        </div>-->
<!--      </foreignObject>-->
    </svg>
  </div>
  <span id="span" style="font-family: 'Propisi';font-size:32px;position: absolute;visibility: hidden"/>
</template>

<script setup>
import {ref, computed, watchPostEffect, nextTick, watch} from "vue";
import {useStore} from 'vuex'
import {base64} from "@/fonts/propisi.js";

const store = useStore()
const lineHeight = ref(35)
const fontSize = 32;
const maxWidth = 620; // Максимальная ширина текста

const TEXT_LINES_PER_PAGE = 23

const isShowText = ref(true)

const rowText = computed(() => store.state.text)

const amountDiagonLines = computed(() => {
  const doubleLines = TEXT_LINES_PER_PAGE * 4
  const test = Math.ceil(maxWidth / 18)
  return doubleLines > test ? doubleLines : test
})

async function getTextWidth(span, text) {
  span.textContent = text;
  return new Promise((res, rej) => {
    setTimeout(() => {
      res(span.offsetWidth)
    }, 30)
  })
}

function setCustomFont() {
  textLinesPerPages.value.forEach((line, index) => {
    const styleEl = document.createElement('style');
    const fontFace = `
@font-face {
  font-family: 'Propisi';
  font-style: normal;
  font-weight: 400;
  src: url(data:font/ttf;base64,${base64}) format('truetype');
}`

    styleEl.appendChild(document.createTextNode(fontFace));

    document.getElementById(`svg-${index}`).appendChild(styleEl)
  })
}

const oldValue = ref(0)
watchPostEffect(() => {
  if (textLinesPerPages.value.length !== oldValue.value) {
    store.commit('setPageAmount', textLinesPerPages.value.length)
    setCustomFont()
  }
})

const textLinesPerPages = ref([])
watchPostEffect(async() => {
  isShowText.value = false
  const text = rowText.value
  if (!text) return []

  // Распили на строки
  const abzacz = text.split('\n')

  const span = document.getElementById('span');

  const res1 = []

  for (const lineText of abzacz) {
    const words = lineText.split(' ');
    let currentLine = '';

    for (const word of words) {
      let testLine = currentLine + (currentLine ? ' ' : '') + word;
      let width = await getTextWidth(span, testLine)

      if (width > maxWidth && currentLine) {
        res1.push(currentLine)
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }

    res1.push(currentLine)
  }

  // Разложили строки по старницам
  const res = []
  const textLinesAmount = res1.length
  if (textLinesAmount <= TEXT_LINES_PER_PAGE) {
    res.push(res1)
  } else {
    let size = TEXT_LINES_PER_PAGE
    for (let i = 0; i < Math.ceil(res1.length / size); i++) {
      res[i] = res1.slice((i * size), (i * size) + size);
    }
  }
  textLinesPerPages.value = res
  isShowText.value = true
} )
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
