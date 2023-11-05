import { html } from 'lit'

// Imports pages
import { HomePage } from './pages/home-page.js'
import './pages/about-page.js'

// Imports router
import './router.js'

const $router = document.querySelector('lit-router')

$router?.setRoutes([
  {
    path: '/',
    name: 'home',
    component: HomePage
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
      const _navigate = (path: string) => router?.navigate({ path })

      return html`
        <h1>Terms</h1>
        <button @click=${() => _navigate('/')}>Home</button>
        <button @click=${() => _navigate('/about')}>About</button>
      `
    }
  }
])

console.log('router: ', $router?.routes)

export const router = $router
