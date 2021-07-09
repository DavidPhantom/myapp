const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Home.vue') },
    ],
  },
  {
    path: '/events',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Events.vue') },
    ],
  },
  {
    path: '/alerts',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Alerts.vue') },
    ],
  },
  {
    path: '/allowList',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/AllowList.vue') },
    ],
  },
  {
    path: '*',
    component: () => import('pages/Error404.vue'),
  },
];

export default routes;
