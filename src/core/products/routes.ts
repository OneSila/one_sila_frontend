export const routes = [
  {
    path: '/products/ean-codes',
    name: 'products.eanCodes.list',
    component: () => import('./ean-codes/ean-codes-list/EanCodesListController.vue')
  },
  {
    path: '/products/ean-codes/create',
    name: 'products.eanCodes.create',
    component: () => import('./ean-codes/ean-code-create/EanCodeCreateController.vue')
  },
  {
    path: '/products/ean-codes/edit/:id',
    name: 'products.eanCodes.edit',
    component: () => import('./ean-codes/ean-code-edit/EanCodeEditController.vue')
  },

  {
    path: '/products/hs-codes',
    name: 'products.hsCodes.list',
    component: () => import('./hs-codes/hs-codes-list/HsCodesListController.vue')
  },
  {
    path: '/products/hs-codes/create',
    name: 'products.hsCodes.create',
    component: () => import('./hs-codes/hs-code-create/HsCodeCreateController.vue')
  },
  {
    path: '/products/hs-codes/edit/:id',
    name: 'products.hsCodes.edit',
    component: () => import('./hs-codes/hs-code-edit/HsCodeEditController.vue')
  },
  {
    path: '/products/hs-codes/show/:id',
    name: 'products.hsCodes.show',
    component: () => import('./hs-codes/hs-code-show/HsCodeShowController.vue')
  },

  {
    path: '/products',
    name: 'products.products.list',
    component: () => import('./products/products-list/ProductsListController.vue')
  },
  {
    path: '/products/create',
    name: 'products.products.create',
    component: () => import('./products/product-create/ProductCreateController.vue')
  },
  {
    path: '/products/product/:id',
    name: 'products.products.show',
    component: () => import('./products/product-show/ProductShowController.vue'),
  }
];
