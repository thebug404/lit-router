# lit-labs/router

`Lit Router` is the official router for [Lit](https://lit.dev/). It deeply integrates with **Lit** core to make building Single Page Applications with **Lit** a breeze.

## Table of Contents

- [lit-labs/router](#lit-labsrouter)
  - [Table of Contents](#table-of-contents)
  - [Roadmap](#roadmap)
  - [Setup](#setup)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Defining routes](#defining-routes)
    - [Tag Name](#tag-name)
    - [Component Class](#component-class)
  - [Dynamic Routes Matching](#dynamic-routes-matching)
  - [Lazy Loading](#lazy-loading)
  - [Nested routes](#nested-routes)
  - [Displayed 404 Page](#displayed-404-page)
  - [Programmatic Navigation](#programmatic-navigation)
    - [Navigate for history](#navigate-for-history)
    - [Navigation utilities](#navigation-utilities)
  - [Query \& Params](#query--params)
  - [Guards](#guards)
  - [API](#api)
    - [`.routes()`](#routes)
    - [`.setRoutes(routes: Partial<RouteConfig>[])`](#setroutesroutes-partialrouteconfig)
    - [`.navigate(navigation: Partial<Navigation>, options?: Partial<NavigationOptions>)`](#navigatenavigation-partialnavigation-options-partialnavigationoptions)
    - [`.forward()`](#forward)
    - [`.back()`](#back)
    - [`.qs(name?: string)`](#qsname-string)
    - [`.params(name?: string)`](#paramsname-string)

## Roadmap

- [x] Basic routing
- [x] Programmatic navigation
- [x] Nested routing
- [x] Lazy loading
- [x] Route params & query
- [x] Validate the 404 page.
- [x] Route guards
- [x] Prevent add element in the history when execute `beforeEnter`.
- [x] Create a domain errors.
- [x] Add tests.
- [ ] Demo.

## Setup

```bash
# Install dependencies
npm install

# Run build
npm run build

# Run tests
npm run test

# Run dev server
npm run dev && npx json-server --watch db.json
```

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

**Typescript**

```js
// Import Lit Router
import { html } from 'lit'
import { Route } from '@lit-labs/router'

// Import Pages/Views
import { HomePage } from './pages/home-page.js'
import './pages/about-page.js'

// Define your routes
const routes: Route[] = [
  { path: '/', component: HomePage },
  { path: '/about', component: 'about-page' },
  {
    path: '/terms',
    component: () => import('./pages/terms-page.js').then((module) => module.TermsPage)
  }
]

// Get a router
const router = document.querySelector('lit-router')

// Register your routes
router.setRoutes(routes)
```

## Defining routes

`Lit Router` provides a simple API to define routes. We can define router of many types. Below are some examples:

### Tag Name

```ts
import './pages/home-page.js'
import './pages/about-page.js'

const routes: Route[] = [
  { path: '/', component: 'home-page' },
  { path: '/about', component: 'about-page' }
]
```

> **Warning**
> When defining our routes in this way you must have special control with the name of your component that you have defined through the `@customElement` or `customElements.define`. Otherwise your view cannot be rendered.

### Component Class

```ts
import { HomePage } from './pages/home-page.js'
import { AboutPage } from './pages/about-page.js'

const routes: Route[] = [
  { path: '/', component: HomePage },
  { path: '/about', component: AboutPage }
]
```

## Dynamic Routes Matching

`Lit Router` also provides a simple API to define dynamic routes. We can define dynamic routes of many types. Below are some examples:

```ts
import { UserPage } from './pages/user-page.js'

const routes: Route[] = [
  { path: '/users/:id', component: UserPage }
]
```

> **Info**
> The API used to define dynamic route is [URLPattern](https://developer.mozilla.org/en-US/docs/Web/API/URLPattern).

## Lazy Loading

Lazy loading is a technique for loading pages on demand. This means that we only load the page when the user navigates to it. This is very useful when we have a large application and we want to improve the performance of our application. Here's an example:

```ts
const routes: Route[] = [
  {
    path: '/',
    component: () => import('./pages/home-page.js').then((m) => m.HomePage)
  }
]
```

## Nested routes

Many times we need to define nested because we have a page that has a sidebar and we want to render the content of the sidebar in a specific place. For this we can use the `children` property. Here's an example:

```ts
const routes: Route[] = [
  {
    path: '/',
    component: DashboardPage,
    children: [
      { path: '/settings', component: SettingsPage }
    ]
  }
]
```

## Displayed 404 Page

To display a 404 page, we can define a route with the `*` path. Here's an example:

```ts
const routes: Route[] = [
  { path: '/', component: HomePage },
  { path: '/about', component: AboutPage },
  { path: '*', component: NotFoundPage }
]
```

## Programmatic Navigation

`Lit Router` also provides a simple API for programmatic navigation. You can use the `navigate` method to navigate to a specific route. Here's an example:

```ts
import { router } from './index.js'

// Navigate by path
router.navigate({ path: '/about' })
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
navigate({ path: '/about' })

// Navigate forward
forward()

// Navigate back
back()
```

## Query & Params

`Lit Router` also provides a simple API to get the `query` and `params` of the current route. Here's an example:

```ts
import { router } from './index.js'

// Get all queries. Example: /users?name=Ivan&age=23
router.qs() // { name: 'Ivan', age: '23' }

// Get a specific query. Example: /users?name=Ivan&age=23
router.qs('name') // Ivan

// Get all params. Example: /users/1
router.params() // { id: '1' }

// Get a specific param. Example: /users/1
router.params('id') // 1
```

## Guards

The guards are functions that are executed before entering a route. They are very useful when we want to validate that the user has the necessary permissions to enter a route. Here's an example:

```ts
// Define your guard
const isAdminGuard = (router) => {
  const user = localStorage.getItem('user')

  if (user && user.role === 'admin') return true

  router.navigate({ path: '/login' })

  return false
}

const routes: Route[] = [
  {
    path: '/admin',
    component: AdminPage,
    // Execute the guard before entering the route
    beforeEnter: [isAdminGuard]
  }
]
```

Or you can use destructuring to get the router. Here's an example:

```ts
const isAdminGuard = ({ navigate }) => {
  const user = localStorage.getItem('user')

  if (user && user.role === 'admin') return true

  navigate({ path: '/login' })

  return false
}
```

## API

Below is a list of all the methods available on the `Lit Router` API.

### `.routes()`

Returns the list of routes.

### `.setRoutes(routes: Partial<RouteConfig>[])`

Method responsible for setting application routes. It receives an array of type [RouteConfig](#routeconfig) as a parameter.

### `.navigate(navigation: Partial<Navigation>, options?: Partial<NavigationOptions>)`

Method responsible for navigating to a specific route. It receives an object of type [Navigation](#navigation) as a parameter.

### `.forward()`

Method responsible for navigating forward.

### `.back()`

Method responsible for navigating back.

### `.qs(name?: string)`

Method responsible for returning all queries or a specific query.

### `.params(name?: string)`

Method responsible for returning all params or a specific param.
