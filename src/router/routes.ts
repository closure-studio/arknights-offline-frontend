import { RouteConfig } from 'vue-router';

const routes: RouteConfig[] = [
  {
    path: '/',
    component: () => import('layouts/AltLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexView.vue') },
      { path: '/login', component: () => import('pages/Login.vue') },
      { path: '/game/:account', component: () => import('pages/GameView.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
];

export default routes;
