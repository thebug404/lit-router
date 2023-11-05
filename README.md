# lit-labs/router

`Lit Router` is the official router for [Lit](https://lit.dev/). It deeply integrates with **Lit** core to make building Single Page Applications with **Lit** a breeze.

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

## Programmatic Navigation

`Lit Router` also provides a simple API for programmatic navigation. You can use the `navigate` method to navigate to a specific route. Here's an example:

```ts
import { router } from './index.js'

// Navigate by path
router.navigate({ path: '/about' })

// Navigate by name
router.navigate({ name: 'about' })
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

// Navigate by name
navigate({ name: 'about' })

// Navigate forward
forward()

// Navigate back
back()
```
