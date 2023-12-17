import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import 'urlpattern-polyfill'

import { TAG_NAME_ROUTER } from '../src/declarations.js'
import { navigate } from '../src/utilities.js'
import { RouteConfig } from '../src/route.js'
import { LitRouter } from '../src/router.js'
import '../src/router.js'

import { AboutPage } from './pages/about-page.js'
import { HomePage } from './pages/home-page.js'

import {
  _stripExpressionComments,
  _hasFibonacciNumber,
  _delay
} from './utils.js'

const routes: Partial<RouteConfig>[] = [
  { path: '/', component: HomePage },
  { path: '/about', component: AboutPage },
  {
    path: '/dashboard',
    component: () => import('./pages/dashboard/dashboard-page.js').then((m) => m.DashboardPage),
    beforeEnter: [
      ({ navigate, qs }) => {
        const token = qs('token')

        if (token) return true

        navigate({ path: '/' })
        return false
      }
    ],
    children: [
      {
        path: '/users/:id',
        component: () => import('./pages/dashboard/users-page.js').then((m) => m.UsersPage),
        beforeEnter: [
          ({ params }) => {
            const userId = Number(params('id'))

            return _hasFibonacciNumber(userId)
          }
        ]
      }
    ]
  },
  {
    path: '*',
    component: () => import('./pages/notfound-page.js').then((m) => m.NotFoundPage)
  }
]

beforeAll(async () => {
  const $router = document.createElement(TAG_NAME_ROUTER)

  $router.setRoutes(routes)

  document.body.appendChild($router)

  await _delay(50)
})

afterAll(() => {
  const $router = document.querySelector(TAG_NAME_ROUTER) as LitRouter

  document.body.removeChild($router)
})

it('Check that the initial route is (/)', async () => {
  const $router = document.querySelector(TAG_NAME_ROUTER) as LitRouter

  expect($router).toBeDefined()

  const $homePage = $router.querySelector('home-page')
  expect(_stripExpressionComments($homePage!.shadowRoot!.innerHTML)).toBe('<h1>Home Page</h1>')
})

it('Check navigation() function', async () => {
  const $router = document.querySelector(TAG_NAME_ROUTER) as LitRouter

  $router.navigate({ path: '/about' })

  await _delay(50)

  expect($router.querySelector('home-page')).toBeNull()

  const $aboutPage = $router.querySelector('about-page')
  expect(_stripExpressionComments($aboutPage!.shadowRoot!.innerHTML)).toBe('<h1>About Page</h1>')

  navigate({ path: '/' })

  await _delay(50)

  const $homePage = $router.querySelector('home-page')
  expect(_stripExpressionComments($homePage!.shadowRoot!.innerHTML)).toBe('<h1>Home Page</h1>')
})

it('Check wildcard routes (404 not found)', async () => {
  const $router = document.querySelector(TAG_NAME_ROUTER) as LitRouter

  $router.navigate({ path: '/random' })

  await _delay(50)

  const $notFoundPage = $router.querySelector('notfound-page')

  expect(_stripExpressionComments($notFoundPage!.shadowRoot!.innerHTML)).toBe('<h1>404 | Not Found</h1>')
})

it('Check the route guards', async () => {
  const $router = document.querySelector(TAG_NAME_ROUTER) as LitRouter

  $router.navigate({ path: '/dashboard' })

  await _delay(50)

  const $homePage = $router.querySelector('home-page')
  expect(_stripExpressionComments($homePage!.shadowRoot!.innerHTML)).toBe('<h1>Home Page</h1>')

  $router.navigate({
    path: '/dashboard',
    query: { token: '123' }
  })

  await _delay(50)

  const $dashboardPage = $router.querySelector('dashboard-page')
  expect(_stripExpressionComments($dashboardPage!.shadowRoot!.innerHTML)).toMatch(/Dashboard Page/)

  $router.navigate({
    path: '/dashboard/users/4',
    query: { token: '123' }
  })

  await _delay(50)

  const $usersPage = $router.querySelector('users-page')

  expect($usersPage).toBeNull()
  expect(_stripExpressionComments($homePage!.shadowRoot!.innerHTML)).toBe('<h1>Home Page</h1>')
})

it('Check nested routes', async () => {
  const $router = document.querySelector(TAG_NAME_ROUTER) as LitRouter

  $router.navigate({
    path: '/dashboard/users/1',
    query: { token: '123' }
  })

  await _delay(50)

  const $dashboardPage = $router.querySelector('dashboard-page')
  const $usersPage = $router.querySelector('users-page')

  expect(_stripExpressionComments($dashboardPage!.shadowRoot!.innerHTML)).toMatch(/<h1>Dashboard Page<\/h1>/)
  expect(_stripExpressionComments($usersPage!.shadowRoot!.innerHTML)).toBe('<h1>Users Page 1</h1>')
})

it('Check that back() navigation function', async () => {
  const $router = document.querySelector(TAG_NAME_ROUTER) as LitRouter

  $router.back()

  await _delay(50)
  
  const $dashboardPage = $router.querySelector('dashboard-page')

  expect(_stripExpressionComments($dashboardPage!.shadowRoot!.innerHTML)).toMatch(/Dashboard Page/)
})

it('Check that forward() navigation function', async () => {
  const $router = document.querySelector(TAG_NAME_ROUTER) as LitRouter

  $router.forward()

  await _delay(50)

  const $usersPage = $router.querySelector('users-page')

  expect(_stripExpressionComments($usersPage!.shadowRoot!.innerHTML)).toBe('<h1>Users Page 1</h1>')
})

it('Check that qs() function', async () => {
  const $router = document.querySelector(TAG_NAME_ROUTER) as LitRouter

  $router.navigate({
    path: '/dashboard/users/8',
    query: {
      token: '123',
      name: 'Ivan Guevara',
      country: 'El Salvador',
      age: '23'
    }
  })

  await _delay(100)

  const queriesObject = $router.qs()

  expect(queriesObject).toEqual({
    token: '123',
    name: 'Ivan Guevara',
    country: 'El Salvador',
    age: '23'
  })

  const token = $router.qs('token')
  const name = $router.qs('name')
  const country = $router.qs('country')

  expect(token).toBe('123')
  expect(name).toBe('Ivan Guevara')
  expect(country).toBe('El Salvador')
})

it('Check that params() function', async () => {
  const $router = document.querySelector(TAG_NAME_ROUTER) as LitRouter

  $router.navigate({
    path: '/dashboard/users/13',
    query: { token: '123' }
  })

  await _delay(50)

  const paramsObject = $router.params()
  expect(paramsObject).toEqual({ id: '13' })

  const id = $router.params('id')
  expect(id).toBe('13')
})

it('Check that routes() function', async () => {
  const $router = document.querySelector(TAG_NAME_ROUTER) as LitRouter

  expect($router.routes()).toHaveLength(4)
})
