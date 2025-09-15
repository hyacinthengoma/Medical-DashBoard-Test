// src/router/routes.ts
import { createRouter, createWebHistory } from 'vue-router';
import Dashboard from '@/views/Dashboard.vue';
import PatientDetails from '@/views/PatientDetails.vue'
import PatientEdit from '@/views/PatientEdit.vue'

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard,
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  },

  {
    path: '/patients/:id',
    name: 'PatientDetails',
    component: PatientDetails,
    props: route => ({ patientId: Number(route.params.id) }), // Permet de passer l'ID comme prop
  },

  {
    path: '/patients/:id/edit',
    name: 'PatientEdit',
    component: PatientEdit,
    props: route => ({ patientId: Number(route.params.id) }),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
