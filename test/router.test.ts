import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import 'urlpattern-polyfill'

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
  const $router = document.createElement('lit-router')

  $router.setRoutes(routes)

  document.body.appendChild($router)

  await _delay(50)
})

afterAll(() => {
  const $router = document.querySelector('lit-router') as LitRouter

  document.body.removeChild($router)
})

describe('router', () => {
  it('Check that the renderes component is home-page', async () => {
    const $router = document.querySelector('lit-router') as LitRouter

    const $homePage = $router.querySelector('home-page')

    expect(_stripExpressionComments($homePage!.shadowRoot!.innerHTML)).toBe('<h1>Home Page</h1>')
  })

  it('Check that the renderes component is about-page', async () => {
    const $router = document.querySelector('lit-router') as LitRouter

    $router.navigate({ path: '/about' })

    await _delay(50)

    const $aboutPage = $router.querySelector('about-page')

    expect(_stripExpressionComments($aboutPage!.shadowRoot!.innerHTML)).toBe('<h1>About Page</h1>')
  })

  it('Check that back() navigation works', async () => {
    const $router = document.querySelector('lit-router') as LitRouter

    $router.back()

    await _delay(50)

    const $homePage = $router.querySelector('home-page')

    expect(_stripExpressionComments($homePage!.shadowRoot!.innerHTML)).toBe('<h1>Home Page</h1>')
  })

  it('Check that forward() navigation works', async () => {
    const $router = document.querySelector('lit-router') as LitRouter

    $router.forward()

    await _delay(50)

    const $aboutPage = $router.querySelector('about-page')

    expect(_stripExpressionComments($aboutPage!.shadowRoot!.innerHTML)).toBe('<h1>About Page</h1>')
  })

  it('Check that the renderes component is notfound-page', async () => {
    const $router = document.querySelector('lit-router') as LitRouter

    $router.navigate({ path: '/random' })

    await _delay(50)

    const $notFoundPage = $router.querySelector('notfound-page')

    expect(_stripExpressionComments($notFoundPage!.shadowRoot!.innerHTML)).toBe('<h1>404 | Not Found</h1>')
  })

  it('Check that the renderes component is not dashboard-page', async () => {
    const $router = document.querySelector('lit-router') as LitRouter

    $router.navigate({ path: '/dashboard' })

    await _delay(50)

    const $dashboardPage = $router.querySelector('dashboard-page')
    expect($dashboardPage).toBeNull()

    const $homePage = $router.querySelector('home-page')
    expect(_stripExpressionComments($homePage!.shadowRoot!.innerHTML)).toBe('<h1>Home Page</h1>')
  })

  it('Check that the renderes component is dashboard-page', async () => {
    const $router = document.querySelector('lit-router') as LitRouter

    $router.navigate({
      path: '/dashboard',
      query: { token: '123' }
    })

    await _delay(50)

    const $dashboardPage = $router.querySelector('dashboard-page')

    expect(_stripExpressionComments($dashboardPage!.shadowRoot!.innerHTML)).toMatch(/Dashboard Page/)
  })

  it('Check that the renderes component is not users-page', async () => {
    const $router = document.querySelector('lit-router') as LitRouter

    $router.navigate({
      path: '/dashboard/users/4',
      query: { token: '123' }
    })

    await _delay(50)

    const $usersPage = $router.querySelector('users-page')
    expect($usersPage).toBeNull()

    const $dashboardPage = $router.querySelector('dashboard-page')
    expect(_stripExpressionComments($dashboardPage!.shadowRoot!.innerHTML)).toMatch(/Dashboard Page/)
  })

  it('Check that the renderes component is users-page', async () => {
    const $router = document.querySelector('lit-router') as LitRouter

    $router.navigate({
      path: '/dashboard/users/1',
      query: { token: '123' }
    })

    await _delay(50)

    const $usersPage = $router.querySelector('users-page')

    expect(_stripExpressionComments($usersPage!.shadowRoot!.innerHTML)).toBe('<h1>Users Page 1</h1>')
  })
})