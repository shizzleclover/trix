import { createApp } from 'vue'
{{#if styling}}
import './style.css'
{{/if}}
import App from './App.vue'

createApp(App).mount('#app')
