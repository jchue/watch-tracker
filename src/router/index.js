import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';

const routes = [
  {
    path     : '/',
    name     : 'Home',
    component: Home,
  },
  {
    path     : '/shows/:id',
    name     : 'Show',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Show.vue'),
  },
  {
    path     : '/movies/:id',
    name     : 'Movie',
    component: () => import(/* webpackChunkName: "about" */ '../views/Movie.vue'),
  },
  {
    path     : '/:pathMatch(.*)*',
    name     : '404',
    component: () => import('../views/404.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
