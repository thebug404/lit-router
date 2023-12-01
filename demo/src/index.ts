import { RouteConfig } from '../../dist/index.js'
import '../../dist/index.js'

import { DashboardPage } from './pages/dashboard.page.js'

const $router = document.querySelector('lit-router')

const routes: Partial<RouteConfig>[] = [
  {
    path: '/',
    component: DashboardPage
  }
]

$router?.setRoutes(routes)
