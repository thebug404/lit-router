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

  /**
   * List of registered routes.
   */
  get routes (): Route[] {
    return this._routes
  }

  /**
   * Returns true if the router has a route with the given path.
   * @param path The path of route.
   */
  hasRouteByPath (path: string): boolean {
    return this._routes.some((route) => route.match(path))
  }

  /**
   * Returns true if the router has a route with the given name.
   * @param name The name of route.
   */
  hasRouteByName (name: string): boolean {
    if (!name) return false

    return this._routes.some((route) => route.name === name)
  }

  /**
   * Returns the route with the given name.
   * @param path The path of route.
   */
  findRouteByPath (path: string): Route | undefined {
    return this._routes.find((route) => route.match(path))
  }

  /**
   * Adds a new route to the router configuration.
   *
   * @param {Route | RouteOptions} route The route to be added, either as a `Route` instance or a `RouteOptions` object.
   * @throws {Error} Throws an error if a route with the same path or name already exists.
   */
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

  /**
   * Adds a list of routes to the router configuration.
   * @param routes A list of routes.
   */
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
