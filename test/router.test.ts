import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'

import 'urlpattern-polyfill'

import { RouteConfig } from '../src/route.js'
import { LitRouter } from '../src/router.js'
import '../src/router.js'

import { AboutPage } from './pages/about-page.js'
import { HomePage } from './pages/home-page.js'

const routes: Partial<RouteConfig>[] = [
  { path: '/', component: HomePage },
  { path: '/about', component: AboutPage }
]

const _delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

const _stripExpressionComments = (html: string) => {
  return html.replace(/<!--\?lit\$[0-9]+\$-->|<!--\??-->/g, '');
}

beforeAll(async () => {
  const $router = document.createElement('lit-router')

  $router.setRoutes(routes)

  document.body.appendChild($router)

  await _delay(100)
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

    await _delay(100)

    const $aboutPage = $router.querySelector('about-page')

    expect(_stripExpressionComments($aboutPage!.shadowRoot!.innerHTML)).toBe('<h1>About Page</h1>')
  })

  it('Check that back() navigation works', async () => {
    const $router = document.querySelector('lit-router') as LitRouter

    $router.back()

    await _delay(100)

    const $homePage = $router.querySelector('home-page')

    expect(_stripExpressionComments($homePage!.shadowRoot!.innerHTML)).toBe('<h1>Home Page</h1>')
  })

  it('Check that forward() navigation works', async () => {
    const $router = document.querySelector('lit-router') as LitRouter

    $router.forward()

    await _delay(100)

    const $aboutPage = $router.querySelector('about-page')

    expect(_stripExpressionComments($aboutPage!.shadowRoot!.innerHTML)).toBe('<h1>About Page</h1>')
  })
})