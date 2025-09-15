import { createApp } from 'vue';
import App from './App.vue';
import router from './router/routes';
import { createPinia } from 'pinia';
import './assets/tailwind.css';
import Sonner from 'vue-sonner'; // Importation par défaut

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(Sonner); // Utilisation du plugin correctement importé

app.mount('#app');
