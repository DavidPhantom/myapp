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
      { path: '', component: () => import('pages/alerts/Alerts.vue') },
    ],
  },
  {
    path: '/settings-general',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/settings/general/General.vue') },
    ],
  },
  {
    path: '/settings-cameras',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/settings/cameras/Cameras.vue') },
    ],
  },

  {
    path: '*',
    component: () => import('pages/Error404.vue'),
  },
];

export default routes;
