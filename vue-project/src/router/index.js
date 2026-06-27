
import { createRouter, createWebHistory } from 'vue-router';
import App from '../App.vue';  // The main page
import Home from '../Home.vue'; 
import divination from '../divination.vue';
import period from '../period.vue';

const routes = [
 // { path: '/', component: () => import('../App.vue') },
   { path: '/', component: () => import('../Home.vue') },
  { path: '/divination', component: () => import('../divination.vue') },
  { path: '/period', component: () => import('../period.vue') }
]


export const router = createRouter({
  history: createWebHistory('/my-app/'), // Add your repo name here
  routes
});
