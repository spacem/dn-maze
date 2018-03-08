import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './components/App';
import HomeApp from './components/Home';
import DesktopTreeApp from './components/desktop/Desktop';
import MobileTreeApp from './components/mobile/Mobile';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    component: App,
    children: [
      { path: '', component: HomeApp, name: 'desktop-home' },
      {
        path: ':slug([a-z]{2,})',
        name: 'desktop',
        component: DesktopTreeApp,
        children: [
          {
            path: ':path',
            name: 'desktop-build',
          },
        ],
      },

      { path: 'm', component: HomeApp, name: 'mobile-home' },
      {
        path: 'm/:slug([a-z]{2,})',
        name: 'mobile',
        component: MobileTreeApp,
        children: [
          {
            path: ':path',
            name: 'mobile-build',
          },
        ],
      },
    ],
  },
];

const router = new VueRouter({
  routes,
});

export default router;
