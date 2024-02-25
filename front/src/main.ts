import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'
import './index.css'
import 'tippy.js/dist/tippy.css' // optional for styling
import router from './router'
import VueTippy from 'vue-tippy'
const pinia = createPinia()

createApp(App).use(VueTippy).use(pinia).use(router).mount('#app')
