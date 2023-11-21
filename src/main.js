import { createApp } from 'vue'
import App from './App.vue'
import './style.css'
import router from './router/router'
import { VueHtmlToPaper } from 'vue-html-to-paper'


const app = createApp(App)
app.use(router)
app.use(VueHtmlToPaper)

app.mount('#app');