// Imports pages
import './pages/about-page.js'
import './pages/home-page.js'

// Imports router
import './router.js'

const $router = document.querySelector('lit-router')

$router?.setRoutes([
  {
    path: '/',
    name: 'home',
    component: 'home-page'
  },
  {
    path: '/about',
    name: 'about',
    component: 'about-page'
  }
])

console.log('router: ', $router?.routes)

// setTimeout(() => {
//   $router?.navigate({ path: '/about' })
// }, 3000)
