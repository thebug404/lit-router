import { customElement, state } from 'lit/decorators.js'
import { LitElement } from 'lit'
import { Task } from '@lit/task'

import { Navigation, RouteConfig } from './declarations.js'
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

  /**
   * List of registered routes.
   */
  routes (): Route[] {
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
   * Retrieves an object representing the parameters present in the current route.
   * 
   * @example
   * ```js
   * // URL: https://example.com/users/1
   * router.params() // { userId: '1' }
   * ```
   */
  params (): Record<string, string> {
    const { pathname, href } = window.location;

    // Find the route corresponding to the current pathname
    const route = this.findRouteByPath(pathname);

    // If the route is not found, return an empty object
    if (!route) return {};

    // Extract parameters from the URL using the route's regular expression
    const { pathname: pathnameObject } = route.urlPattern.exec(href);
    const { groups } = pathnameObject;

    return groups || {};
  }

  /**
   * Retrieves the value of a specific parameter from the current route.
   *
   * @param {string} name - The name of the parameter to retrieve.
   * 
   * @example
   * ```js
   * // URL: https://example.com/users/1
   * router.param('userId') // '1'
   * ```
   */
  param (name: string): string | null  {
    const params = this.params();

    return params[name] || null;
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
   * Returns the route with the given name.
   * @param path The path of route.
   */
  findRouteByPath (path: string, routes: Route[] = this.routes(), onlyLeafRoute = false): Route | undefined {
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
   * Creates a new route based on the provided route configuration.
   * @param routeConfig The route configuration.
   * @throws {Error} Throws an error if 'path' or 'component' is missing.
   */
  private _createRouteFromConfig (routeConfig: Partial<RouteConfig>): Route {
    const { path, component } = routeConfig

    if (!path) {
      throw new Error('Missing path.')
    }

    if (!component) {
      throw new Error('Missing component.')
    }

    const route = new Route(path, component)

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
        throw new Error(`${child.path} children route has already been declared`)
      }

      route.children.push(childRoute)
    })

    return route
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

    // We get the current route from the URL and then 
    // navigate to the current route to trigger the rendering.
    // This is necessary to render the content when the routes
    // have been set for the first time.
    const { href } = window.location

    this.navigate({ href })
  }

  /**
   * Navigates to a new route based on the provided navigation options.
   *
   * @param {Partial<Navigation>} navigation - The navigation options, which can include 'name' or 'path'.
   * @throws {Error} Throws an error if 'path' is missing.
   */
  navigate (navigation: Partial<Navigation>): void {
    const { pathname, href } = navigation

    if (!pathname && !href) {
      throw new Error('Missing path.')
    }

    const urlInstance = new URL(pathname || href || '', window.location.origin)

    // Add query parameters to URL instance.
    if (navigation.query && Object.keys(navigation.query).length) {
      const urlSearchParams = new URLSearchParams(navigation.query)

      urlInstance.search = urlSearchParams.toString()
    }

    window.history.pushState({}, '', urlInstance.href)

    const event = new PopStateEvent('popstate', {
      state: urlInstance
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
    
    if (ev.defaultPrevented || isNonNavigationClick) return

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

    if (href === '' || href.startsWith('mailto:')) return

    const location = window.location;

    if (anchor.origin !== origin) return

    ev.preventDefault();

    if (href === location.href) return

    this.navigate({ href })
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

    const { pathname, href } = state
    const _pathname = pathname || new URL(href || '').pathname

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
