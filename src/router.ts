import { customElement, state } from 'lit/decorators.js'
import { LitElement, PropertyValueMap, html } from 'lit'

import { RouteOptions, NavigationOptions, Navigation } from './declarations.js'
import { Route } from './route.js'

declare global {
  interface HTMLElementTagNameMap {
    'lit-router': LitRouter
  }
}

@customElement("lit-router")
export class LitRouter extends LitElement {
  @state()
  private _currentRoute: Route | null = null

  @state()
  private readonly _routes: Route[] = []

  connectedCallback(): void {
    super.connectedCallback()

    window.addEventListener('popstate', this._onHandlePopState.bind(this))
  }

  disconnectedCallback(): void {
    super.disconnectedCallback()

    window.removeEventListener('popstate', this._onHandlePopState.bind(this))
  }

  protected firstUpdated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    this.navigate({ path: window.location.pathname })
  }

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
  findRouteByPath (path: string): Route | null {
    return this._routes.find((route) => route.match(path)) || null
  }

  /**
   * Returns the route with the given name.
   * @param name The name of route.
   */
  findRouteByName (name: string): Route | null {
    return this._routes.find((route) => route.name === name) || null
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

  /**
   * Navigates to a new route based on the provided navigation options.
   *
   * @param {Partial<Navigation>} navigation - The navigation options, which can include 'name' or 'path'.
   * @throws {Error} Throws an error if 'path' is missing.
   */
  navigate (navigation: Partial<Navigation>, options: Partial<NavigationOptions> = {}): void {
    const { preventHistory } = Object.assign(
      { preventHistory: false },
      options
    )

    const { name, path } = navigation

    // Search by name.
    if (name) {
      const route = this.findRouteByName(name)

      if (!route) {
        return console.warn(new Error(`Route with name "${name}" not found.`))
      }

      this._currentRoute = route

      if (!preventHistory) {
        window.history.pushState({}, '', route.path)
      }

      return
    }

    if (!path) {
      throw new Error('Missing path.')
    }

    // Search by path.
    const route = this.findRouteByPath(path)

    if (!route) {
      return console.warn(new Error(`Route with path "${path}" not found.`))
    }

    this._currentRoute = route

    if (!preventHistory) {
      window.history.pushState({}, '', route.path)
    }
  }

  /**
   * Navigates to the next page in session history.
   */
  forward (): void {
    window.history.forward()
  }

  /**
   * Navigates to the previous page in session history.
   */
  back (): void {
    window.history.back()
  }

  /**
   * Handles the popstate event.
   */
  private _onHandlePopState (ev: PopStateEvent): void {
    const target = ev.target as Window

    const pathname = target.location.pathname

    this.navigate(
      { path: pathname },
      { preventHistory: true }
    )
  }

  protected createRenderRoot (): Element | ShadowRoot {
    return this
  }

  protected render (): unknown {
    return html`${this._currentRoute?.resolve()}`
  }
}
