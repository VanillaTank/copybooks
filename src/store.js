import { createStore } from 'vuex'

const store = createStore({
    state () {
        return {
            text: ''
        }
    },
    mutations: {
        setText (state, text) {
            state.text = text
        }
    }
})

export default store
