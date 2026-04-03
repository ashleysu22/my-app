import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'

// 1. Import VCalendar and Styles
import VCalendar from 'v-calendar'; 
import 'v-calendar/style.css';      

// 2. Import your Router
import { router } from './router' 

const app = createApp(App)

// 3. Register each plugin SEPARATELY
app.use(router)           // Register Router
app.use(VCalendar, {})    // Register Calendar

app.mount('#app')
