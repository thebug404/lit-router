import 'https://unpkg.com/@holejs/wc@0.17.1/dist/card.js?module';
import 'https://unpkg.com/@holejs/wc@0.17.1/dist/chip.js?module';

import { RouteConfig } from '../../dist/index.js'
import '../../dist/index.js'

import { DashboardLayout } from './pages/dahboard.layout.js';
import { DashboardPage } from './pages/dashboard.page.js'
import './pages/users.page.js'

const $router = document.querySelector('lit-router')

const routes: Partial<RouteConfig>[] = [
  {
    path: '/dashboard',
    component: DashboardLayout,
     beforeEnter: [
      ({ navigate }) => {
        navigate({ path: '/dashboard/' })
        return false
      }
     ],
    children: [
      {
        path: '/',
        component: DashboardPage
      },
      {
        path: '/users',
        component: 'users-page'
      }
    ]
  }
]

$router?.setRoutes(routes as any)
