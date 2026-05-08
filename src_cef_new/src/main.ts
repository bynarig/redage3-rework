import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { i18n } from 'lang'
import App from './App.vue'

if (import.meta.env.DEV) {
  await import('./dev/mp-mock')
}

const app = createApp(App)

app.use(createPinia())
app.use(i18n)


app.mount('#app')
