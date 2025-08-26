import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import i18n from './i18n'
import installToast from './plugins/toast'

import App from './App.vue'
import router from './router'
import { useThemeStore } from './stores/theme'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(i18n)
installToast(app)

// Initialize theme after Pinia is set up
const themeStore = useThemeStore()
themeStore.updateThemeClass()

app.mount('#app')
