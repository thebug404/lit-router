import { customElement } from "lit/decorators.js"
import { LitElement, html } from "lit"

import { RouteOptions } from './declarations.js'
import { Route } from './route.js'

declare global {
  interface HTMLElementTagNameMap {
    'lit-router': LitRouter
  }
}

@customElement("lit-router")
export class LitRouter extends LitElement{
  private readonly _routes: Route[] = []

  get routes (): Route[] {
    return this._routes
  }

  hasRouteByPath (path: string): boolean {
    return this._routes.some((route) => route.match(path))
  }

  hasRouteByName (name: string): boolean {
    if (!name) return false

    return this._routes.some((route) => route.name === name)
  }

  findRouteByPath (path: string): Route | undefined {
    return this._routes.find((route) => route.match(path))
  }

  setRoute (route: Route | RouteOptions): void {
    // Validate the route is not already defined.
    if (this.hasRouteByPath(route.path) || this.hasRouteByName(route?.name || '')) {
      throw new Error(`Route with path "${route.path}" already exists.`)
    }

    // Validate the route is a instance of Route.
    if (route instanceof Route) {
      this._routes.push(route)
      return
    }

    // Create a new instance of Route.
    this._routes.push(new Route(route))
  }

  setRoutes (routes: (Route | RouteOptions)[]): void {
    routes.forEach((route) => this.setRoute(route))
  }

  protected createRenderRoot (): Element | ShadowRoot {
    return this
  }

  protected render (): unknown {
    const path = window.location.pathname

    const route = this.findRouteByPath(path)

    return html`${route?.resolve()}`
  }
}
