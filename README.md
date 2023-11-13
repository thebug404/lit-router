# lit-labs/router

`Lit Router` is the official router for [Lit](https://lit.dev/). It deeply integrates with **Lit** core to make building Single Page Applications with **Lit** a breeze.

## Roadmap

- [x] Basic routing
- [x] Programmatic navigation
- [x] Nested routing
- [x] Lazy loading
- [x] Route params & query
- [ ] Route guards

## Installation

```bash
npm i @lit-labs/router
```

## Usage

Creating a single-page application with `Lit` + `Lit Router` is a piece of cake! 🍰 With Lit, we're building our application using components, and when we add `Lit Router` to the mix, all we have to do is assign our components to the routes and let `Lit Router` work its magic to render them in the right place. ✨ Here's a simple example for you: 🚀

**HTML**

```html
<lit-router></lit-router>
```

**Typescript/Javascript**

```js
// Import Lit Router
import { html } from 'lit'
import '@lit-labs/router'

// Import Pages/Views
import { HomePage } from './pages/home-page.js'
import './pages/about-page.js'

// Define your routes
const routes = [
  { path: '/', component: HomePage },
  { path: '/about', component: 'about-page' },
  { path: '/users/:id', component: () => html`<h1>Users</h1>` },
]

// Get a router
const router = document.querySelector('lit-router')

// Register your routes
router.setRoutes(routes)
```

## Defining routes

`Lit Router` provides a simple API to define routes. We can define router of many types. Below are some examples:

**Tag Name**

```ts
import { Route } from '@lit-labs/router'

import './pages/home-page.js'
import './pages/about-page.js'

const routes: Route[] = [
  { path: '/', component: 'home-page' },
  { path: '/about', component: 'about-page' }
]

const router = document.querySelector('lit-router')

router.setRoutes(routes)
```

> **Warning**
> When defining our routes in this way you must have special control with the name of your component that you have defined through the `@customElement` or `customElements.define`. Otherwise your view cannot be rendered.

**Component Class**

```ts
import { Route } from '@lit-labs/router'

import { HomePage } from './pages/home-page.js'
import { AboutPage } from './pages/about-page.js'

const routes: Route[] = [
  { path: '/', component: HomePage },
  { path: '/about', component: AboutPage }
]

const router = document.querySelector('lit-router')

router.setRoutes(routes)
```

**Component Function**

```ts
import { Route } from '@lit-labs/router'
import { html } from 'lit'

const routes: Route[] = [
  { path: '/', component: () => html`<h1>Home</h1>` },
  { path: '/about', component: () => html`<h1>About</h1>` }
]

const router = document.querySelector('lit-router')

router.setRoutes(routes)
```

> **Warning**
> When defining our routes of this type, we cannot nest routes.

## Programmatic Navigation

`Lit Router` also provides a simple API for programmatic navigation. You can use the `navigate` method to navigate to a specific route. Here's an example:

```ts
import { router } from './index.js'

// Navigate by path
router.navigate({ pathname: '/about' })
```

### Navigate for history

You can also use the `forward` & `back` method to navigate for history. Here's an example:

```ts
import { router } from './index.js'

// Navigate forward
router.forward()

// Navigate back
router.back()
```

### Navigation utilities

`Lit Router` also provides some utilities to help you with navigation. Here's an example:

```ts
import { navigate, forward, back } from '@lit-labs/router'

// Navigate by path
navigate({ pathname: '/about' })

// Navigate forward
forward()

// Navigate back
back()
```

## Lazy Loading

When developing applications that utilize bundles, the JavaScript bundle can grow substantially in size, potentially impacting page load times. To enhance efficiency, it's advantageous to break down the components of each route into distinct chunks, loading them only when the corresponding route is accessed.

`Lit Router` readily offers support for dynamic imports, allowing you to substitute static imports with dynamic ones:

```ts
import { Route } from '@lit-labs/router'

const routes: Route[] = [
  {
    path: '/',
    component: () => import('./pages/home-page.js').then((m) => m.HomePage)
  }
]

const router = document.querySelector('lit-router')

router.setRoutes(routes)
```

## Query & Params

`Lit Router` also provides a simple API to get the `query` and `params` of the current route. Here's an example:

```ts
import { router } from './index.js'

// Get all queries. Example: /users?name=Ivan&age=23
router.queries() // { name: 'Ivan', age: '23' }

// Get a specific query. Example: /users?name=Ivan&age=23
router.query('name') // Ivan

// Get all params. Example: /users/1
router.params() // { id: '1' }

// Get a specific param. Example: /users/1
router.param('id') // 1
```

## API

Below is a list of all the methods available on the `Lit Router` API.

### `.routes()`

Returns the list of routes.

### `.setRoutes(routes: Partial<RouteConfig>[])`

Method responsible for setting application routes. It receives an array of type [RouteConfig](#routeconfig) as a parameter.

### `.navigate(options: Partial<Navigation>)`

Method responsible for navigating to a specific route. It receives an object of type [Navigation](#navigation) as a parameter.

### `.forward()`

Method responsible for navigating forward.

### `.back()`

Method responsible for navigating back.

### `.queries()`

Method responsible for returning all queries.

### `.query(key: string)`

Method responsible for returning a specific query.

### `.params()`

Method responsible for returning all params.

### `.param(key: string)`

Method responsible for returning a specific param.

## Interfaces

Below is a list of all the interfaces available on the `Lit Router` API.

### `Component`

```ts
export type HTMLElementConstructor = typeof HTMLElement

export type Component =
  string |
  HTMLElementConstructor |
  (() => TemplateResult) |
  (() => Promise<unknown>)
```

### `RouteConfig`

```ts
interface RouteConfig {
  path: string;
  component: Component;
  children?: RouteConfig[];
}
```

### `Navigation`

```ts
interface Navigation extends URL {
  query: Record<string, string>;
}
```
