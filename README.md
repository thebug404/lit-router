# lit-labs/router

`Lit Router` is the official router for [Lit](https://lit.dev/). It deeply integrates with **Lit** core to make building Single Page Applications with **Lit** a breeze.

## Installation

```bash
npm i @lit-labs/router
```

## Usage

Creating a single-page application with Lit + Lit Router is a piece of cake! 🍰 With Lit, we're building our application using components, and when we add Lit Router to the mix, all we have to do is assign our components to the routes and let Lit Router work its magic to render them in the right place. ✨ Here's a simple example for you: 🚀

```js
// Import Lit Router
import '@lit-labs/router'

// Define your routes
const routes = [
  { path: '/', component: 'home-page' },
  { path: '/about', component: 'about-page' },
  { path: '/users/:id', component: 'user-page' },
]

// Get a router
const router = document.querySelector('lit-router')

// Register your routes
router.setRoutes(routes)
```
