<template>
  <div class="p-2">
    <textarea
        ref="textarea"
        :value="text"
        resize="none"
        class="outline-none border border-amber-900 rounded w-full p-1"
        placeholder="Введите текст для прописи"
        @input="updateText($event.target.value)"
    ></textarea>
  </div>
</template>

<script setup>
import {ref, onMounted, computed} from "vue";
import { useStore } from 'vuex'

const store = useStore()
const textarea = ref(null)

const text = computed(() => store.state.text)

onMounted (() => {
  autoResize()
})

function updateText (newText) {
  store.commit('setText', newText)
  autoResize()
}

const autoResize = () => {
  textarea.value.style.height = 'auto';
  textarea.value.style.height = (textarea.value.scrollHeight + 10) + 'px';
};
</script>
