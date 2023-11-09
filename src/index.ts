import { html } from 'lit'

// Imports pages
import './pages/about-page.js'

// Imports router
import './router.js'
import { navigate } from './utilities.js'
import { Route } from './route.js'

const $router = document.querySelector('lit-router')

$router?.setRoutes([
  {
    path: '/',
    name: 'home',
    component: () => import('./pages/home-page.js').then((module) => module.HomePage)
  },
  {
    path: '/about',
    name: 'about',
    component: 'about-page'
  },
  {
    path: '/terms',
    name: 'terms',
    component: () => {
      const _navigate = (path: string) => navigate({ path })

      return html`
        <h1>Terms</h1>
        <button @click=${() => _navigate('/')}>Home</button>
        <button @click=${() => _navigate('/about')}>About</button>
      `
    }
  },
  new Route({
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('./pages/dashboard/dashboard-page.js').then((m) => m.DashboardPage),
    children: [
      new Route({
        path: '/dashboard/settings',
        name: 'settings',
        component: () => import('./pages/dashboard/settings-page.js').then((m) => m.SettingsPage)
      })
    ]
  })
])

console.log('router: ', $router?.routes)

export const router = $router
