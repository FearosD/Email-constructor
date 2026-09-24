import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import { tokens } from './core/tokens.js';

const app = createApp(App);
app.use(createPinia());
app.mount('#app');

console.log('✅ Дизайн-токены успешно загружены:', tokens);
