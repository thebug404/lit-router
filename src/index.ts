// Imports pages
import './pages/about-page.js'

// Imports router
import './router.js'

const $router = document.querySelector('lit-router')

$router?.setRoutes([
  {
    path: '/',
    component: () => import('./pages/home-page.js').then((module) => module.HomePage)
  },
  {
    path: '/about',
    component: 'about-page'
  },
  {
    path: '/terms',
    component: () => import('./pages/terms-page.js').then((module) => module.TermsPage)
  },
  {
    path: '/dashboard',
    component: () => import('./pages/dashboard/dashboard-page.js').then((module) => module.DashboardPage),
    children: [
      {
        path: '/users/:userId?',
        component: () => import('./pages/dashboard/users-page.js').then((module) => module.UsersPage)
      },
      {
        path: '/settings',
        component: () => import('./pages/dashboard/settings-page.js').then((module) => module.SettingsPage)
      }
    ]
  }
])

console.log('router: ', $router?.routes())

export const router = $router
