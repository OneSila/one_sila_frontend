import * as VueRouter from 'vue-router';

import { routes as authRoutes } from '../../../core/auth/routes';
import { routes as profileRoutes } from '../../../core/profile/routes';
import { PUBLIC_ROUTES } from '../../utils/constants'
import { detectAuth, isAuthenticated, hasCompany } from '../auth';
import { Toast } from '../toast';

let router: VueRouter.Router;

export function buildRouter() {
  router = VueRouter.createRouter({
    history: VueRouter.createWebHistory(),
    routes: [
      ...authRoutes,
      ...profileRoutes,
      {
        path: '',
        name: 'dashboard',
        component: () =>
          import('../../../core/dashboard/dasboard/DashboardController.vue'),
      },
    ],
  });

router.beforeEach((to, from, next) => {
  const auth = detectAuth();
  const routeName = (to.name as string) || '';


    // Authenticated but does not have a company
  if (isAuthenticated(auth) && !hasCompany(auth)) {
    if (routeName === 'auth.register.company') {
      return next();
    }
    return next({ name: 'auth.register.company' });
  }

  // Authenticated and trying to access a public page
  if (PUBLIC_ROUTES.includes(routeName) && isAuthenticated(auth) && hasCompany(auth)) {
    alert('1')
    return next({ name: 'dashboard' });
  }

  // Not authenticated and trying to access a non-public page
  if (!PUBLIC_ROUTES.includes(routeName) && !isAuthenticated(auth)) {
    alert('2')
    return next({ name: 'auth.login' });
  }

  // All other cases
  return next();
});

  router.onError((error) => {
    const regexes = [
      /loading chunk \d* failed./i,
      /Loading.*chunk.*failed./i,
      /ChunkLoadError:.*failed./i,
    ];

    for (const regex of regexes) {
      if (regex.test(error.message)) {
        Toast.warning('New updates! Reloading...');
        window.location.reload();
        break;
      }
    }
  });

  return router;
}

export function getRouter() {
  if (!router) {
    throw new Error('Please instantiate the router first!');
  }

  return router;
}

export function navigateBack(
  router: VueRouter.Router,
  defaultPath?: VueRouter.RouteLocationRaw,
) {
  if (router.options.history.state.back) {
    return router.back();
  }

  return router.replace(defaultPath || '/');
}
