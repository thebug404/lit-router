import { customElement, state } from 'lit/decorators.js'
import { LitElement, PropertyValueMap } from 'lit'
import { Task } from '@lit/task'

import { NavigationOptions, Navigation, RouteConfig } from './declarations.js'
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

  private _renderingTemplateTask = new Task(this, {
    task: async ([_currentRoute]) => _currentRoute?.resolve(),
    args: () => [this._currentRoute]
  })

  connectedCallback(): void {
    super.connectedCallback()

    window.addEventListener('popstate', this._onHandlePopState.bind(this))

    window.addEventListener('click', this._onHandleAnchorClick.bind(this))
  }

  disconnectedCallback(): void {
    super.disconnectedCallback()

    window.removeEventListener('popstate', this._onHandlePopState.bind(this))

    window.removeEventListener('click', this._onHandleAnchorClick.bind(this))
  }

  protected firstUpdated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    const { href } = window.location

    this.navigate({ href })
  }

  /**
   * List of registered routes.
   */
  get routes (): Route[] {
    return this._routes
  }

  /**
   * Get an object containing the query parameters of the current URL.
   *
   * @example
   * ```js
   * // URL: https://example.com?foo=bar
   * router.queries() // { foo: 'bar' }
   * ```
   */
  queries (): Record<string, string> {
    const urlSearchParams = new URLSearchParams(window.location.search)

    return Object.fromEntries(urlSearchParams.entries())
  }

  /**
   * Returns the query parameter with the given name.
   * @param name The name of query parameter.
   *
   * @example
   * ```js
   * // URL: https://example.com?foo=bar
   * router.query('foo') // 'bar'
   * ```
   */
  query (name: string): string | null {
    const queries = this.queries()

    return queries[name] || null
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
  findRouteByPath (path: string, routes: Route[] = this.routes, onlyLeafRoute = false): Route | undefined {
    const hasLeafRoute = (route: Route) => route.children.length === 0

    const findInChildRoutes = (path: string, children: Route[]) => this.findRouteByPath(path, children, onlyLeafRoute)

    for (const route of routes) {
      if (onlyLeafRoute && route?.match(path)) return route

      if (onlyLeafRoute && route.match(path) && hasLeafRoute(route)) return route

      if (!onlyLeafRoute && route.match(path)) return route

      const childRoute = findInChildRoutes(path, route.children)

      if (childRoute) return childRoute
    }
  }

  /**
   * Returns the route with the given name.
   * @param name The name of route.
   */
  findRouteByName (name: string): Route | null {
    return this._routes.find((route) => route.name === name) || null
  }

  /**
   * Creates a new route based on the provided route configuration.
   * @param routeConfig The route configuration.
   * @throws {Error} Throws an error if 'path' or 'component' is missing.
   */
  private _createRouteFromConfig (routeConfig: Partial<RouteConfig>): Route {
    const { path, name, component } = routeConfig

    if (!path) {
      throw new Error('Missing path.')
    }

    if (!component) {
      throw new Error('Missing component.')
    }

    const route = new Route(path, component)

    route.name = name || ''

    return route
  }

  /**
   * Builds a nested route based on the provided route configuration.
   * @param routeConfig The route configuration.
   * @throws {Error} Throws an error if 'path' or 'component' is missing.
   */
  private _buildNestedRouteFromConfig (routeConfig: Partial<RouteConfig>): Route {
    const { children } = routeConfig

    const route = this._createRouteFromConfig(routeConfig);

    (children || []).forEach((child) => {
      const childRoute = this._buildNestedRouteFromConfig({
        ...child,
        path: `${route.path}${child.path}`
      })

      childRoute.setParent(route)

      if (this.findRouteByPath(child.path, route.children || [])) {
        throw new Error(`${child.name || child.path} children route has already been declared`)
      }

      route.children.push(childRoute)
    })

    return route
  }

  /**
   * Adds a new route to the router configuration.
   *
   * @param {RouteOptions} route The route to be added, either as a `Route` instance or a `RouteOptions` object.
   * @throws {Error} Throws an error if a route with the same path or name already exists.
   */
  setRoute (route: Partial<RouteConfig>): void {
    if (this.hasRouteByPath(route.path || '') || this.hasRouteByName(route?.name || '')) {
      throw new Error(`Route with path "${route.path}" already exists.`)
    }

    const _route = this._createRouteFromConfig(route)

    this._routes.push(_route)
  }

  /**
   * Adds a list of routes to the router configuration.
   * @param routes A list of routes.
   */
  setRoutes (routes: Partial<RouteConfig>[]): void {
    for (const route of routes) {
      const _route = this._buildNestedRouteFromConfig(route)

      this._routes.push(_route)
    }
  }

  /**
   * Navigates to a new route based on the provided navigation options.
   *
   * @param {Partial<Navigation>} navigation - The navigation options, which can include 'name' or 'path'.
   * @throws {Error} Throws an error if 'path' is missing.
   */
  navigate (navigation: Partial<Navigation>, _options: Partial<NavigationOptions> = {}): void {
    const { pathname, href } = navigation

    window.history.pushState({}, '', pathname || href)

    const event = new PopStateEvent('popstate', {
      state: navigation
    })

    window.dispatchEvent(event)
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
   * Handles the click event on anchor elements.
   * @param ev The click event.
   */
  private _onHandleAnchorClick (ev: MouseEvent): void {
    const isNonNavigationClick = 
      ev.button !== 0 ||
      ev.metaKey ||
      ev.ctrlKey ||
      ev.shiftKey;
    
    if (ev.defaultPrevented || isNonNavigationClick) {
      return;
    }

    const anchor = ev
      .composedPath()
      .find((n) => (n as HTMLElement).tagName === 'A') as
      | HTMLAnchorElement
      | undefined;

    if (
      anchor === undefined ||
      anchor.target !== '' ||
      anchor.hasAttribute('download') ||
      anchor.getAttribute('rel') === 'external'
    ) {
      return
    }

    const href = anchor.href;

    if (href === '' || href.startsWith('mailto:')) {
      return;
    }

    const location = window.location;

    if (anchor.origin !== origin) {
      return;
    }

    ev.preventDefault();

    if (href !== location.href) {
      window.history.pushState({}, '', href);

      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  }

  /**
   * Handles the popstate event.
   */
  private _onHandlePopState (ev: PopStateEvent): void {
    const state = ev.state as Partial<Navigation> | null

    if (!state || !Object.keys(state).length) {
      const pathname = window.location.pathname

      const route = this.findRouteByPath(pathname)

      if (!route) {
        return console.warn(new Error(`Route with path "${pathname}" not found.`))
      }
  
      this._currentRoute = route
      return
    }

    const { name, pathname, href } = state
    const _pathname = pathname || new URL(href || '').pathname

    if (name) {
      const route = this.findRouteByName(name)

      if (!route) {
        return console.warn(new Error(`Route with name "${name}" not found.`))
      }

      this._currentRoute = route
      return
    }

    if (!_pathname) {
      throw new Error('Missing path.')
    }

    const route = this.findRouteByPath(_pathname)

    if (!route) {
      return console.warn(new Error(`Route with path "${_pathname}" not found.`))
    }

    this._currentRoute = route
  }

  protected createRenderRoot (): Element | ShadowRoot {
    return this
  }

  protected render (): unknown {
    return this._renderingTemplateTask.render({
      complete: (template) => template,
    })
  }
}
