import { customElement, state } from 'lit/decorators.js'
import { LitElement } from 'lit'
import { Task } from '@lit/task'

import {
  NavigationOptions,
  TAG_NAME_ROUTER,
  Suscription,
  Navigation,
  Router
} from './declarations.js'

import {
  RouteAlreadyExistsError,
  MissingComponentError,
  RouteNotFoundError,
  MissingPathError
} from './errors.js'

import { Route, RouteConfig } from './route.js'

declare global {
  interface HTMLElementTagNameMap {
    [TAG_NAME_ROUTER]: LitRouter
  }
}

@customElement(TAG_NAME_ROUTER)
export class LitRouter extends LitElement implements Router {
  @state()
  private _currentRoute: Route | null = null

  @state()
  private readonly _routes: Route[] = []

  private _renderingTemplateTask = new Task(this, {
    task: async ([_currentRoute]) => _currentRoute?.resolve(),
    args: () => [this._currentRoute]
  })

  connectedCallback (): void {
    super.connectedCallback()

    window.addEventListener('popstate', this._onHandlePopState.bind(this))

    window.addEventListener('click', this._onHandleAnchorClick.bind(this))
  }

  disconnectedCallback (): void {
    super.disconnectedCallback()

    window.removeEventListener('popstate', this._onHandlePopState.bind(this))

    window.removeEventListener('click', this._onHandleAnchorClick.bind(this))
  }

  routes (): Route[] {
    return this._routes
  }

  qs (name: string = ''): Record<string, string> | string | null {
    const urlSearchParams = new URLSearchParams(window.location.search)

    return this._extractParameters(urlSearchParams, name)
  }

  params (name: string = ''): Record<string, string> | string | null {
    const { origin, pathname } = window.location;

    const route = this._findRouteByPath(pathname);

    if (!route) return {};

    // Extract parameters from the URL using the route's regular expression
    const { pathname: pathnameObject } = route.urlPattern.exec(origin + pathname) || {};

    return this._extractParameters(pathnameObject, name)
  }

  onChange (_callback: (router: LitRouter) => void): Suscription {
    const callback = () => _callback(this)

    window.addEventListener('popstate', callback)

    const subscription = {
      unsubscribe: () => window.removeEventListener('popstate', callback)
    }

    return subscription
  }

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

  async navigate (navigation: Partial<Navigation>, options: Partial<NavigationOptions> = {}): Promise<void> {
    const { enableHistoryPushState } = Object.assign(
      { enableHistoryPushState: true },
      options
    )

    const { path, href } = navigation

    if (!path && !href) {
      return console.error(new MissingPathError());
    }

    const urlInstance = new URL(path || href || '', window.location.origin)

    Object.keys(navigation.query || {}).forEach((key) => {
      const value = navigation.query![key]
      urlInstance.searchParams.append(key, value)
    })

    const { pathname } = urlInstance
    const route = this._findRouteByPath(pathname)

    if (!route) {
      return console.warn(new RouteNotFoundError(pathname))
    }

    // The qs and params methods are wrapped for beforeEnter protection
    // to ensure that they return the query and parameters of the path
    // we want to navigate to, not the current one.
    const qs = (name?: string) => this._extractParameters(urlInstance.searchParams, name)

    const params = (name?: string) => {
      const { pathname, origin } = urlInstance

      const route = this._findRouteByPath(pathname)

      if (!route) return {};

      const { pathname: pathnameObject } = route.urlPattern.exec(origin + pathname) || {};

      return this._extractParameters(pathnameObject, name)
    }
   
    const isAllowed = await route.resolveRecursiveGuard({
      navigate: this.navigate.bind(this),
      forward: this.forward.bind(this),
      back: this.back.bind(this),
      qs,
      params
    })

    if (!isAllowed) return

    this._currentRoute = route

    if (!enableHistoryPushState) return

    window.history.pushState({}, '', urlInstance.href)
  }

  forward (): void {
    window.history.forward()
  }

  back (): void {
    window.history.back()
  }

  /**
   * Find a route in the navigation hierarchy.
   *
   * @private
   * @param {string} path - The path to search for.
   * @param {Route[]} [routes=this.routes()] - The array of routes to search within.
   * @param {boolean} [onlyLeafRoute=false] - If true, only consider leaf routes (routes without children).
   */
  private _findRouteByPath (
    path: string,
    routes: Route[] = this.routes(),
    onlyLeafRoute: boolean = false
  ): Route | undefined {
    const hasLeafRoute = (route: Route) => route.children.length === 0

    const findInChildRoutes = (path: string, children: Route[]) =>
      this._findRouteByPath(path, children, onlyLeafRoute)

    for (const route of routes) {
      if (onlyLeafRoute && route?.match(path)) return route

      if (onlyLeafRoute && route.match(path) && hasLeafRoute(route)) return route

      if (!onlyLeafRoute && route.match(path)) return route

      const childRoute = findInChildRoutes(path, route.children as Route[])

      if (childRoute) return childRoute
    }
  }

  /**
   * Creates a new route based on the provided route configuration.
   *
   * @param routeConfig The route configuration.
   * @throws {Error} Throws an error if 'path' or 'component' is missing.
   */
  private _createRouteFromConfig (routeConfig: Partial<RouteConfig>): Route {
    const { path, component } = routeConfig

    if (!path) {
      throw new MissingPathError()
    }

    if (!component) {
      throw new MissingComponentError()
    }

    const route = new Route(path, component)

    if (routeConfig.beforeEnter) {
      route.beforeEnter = routeConfig.beforeEnter
    }

    return route
  }
  
  /**
   * Builds a nested route based on the provided route configuration.
   *
   * @param routeConfig The route configuration.
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

      if (this._findRouteByPath(child.path as string, (route.children || []) as Route[])) {
        return console.error(new RouteAlreadyExistsError(child.path as string))
      }

      route.children.push(childRoute)
    })

    return route
  }

  private _extractParameters (
    source: URLSearchParams | RegExpExecArray | null,
    name?: string
  ): Record<string, string> | string | null {
    if (!source) return {};
  
    if (name) {
      return source instanceof URLSearchParams
        ? source.get(name)
        : null;
    }
  
    return source instanceof URLSearchParams
      ? Object.fromEntries(source.entries())
      : source.groups || {};
  }

  /**
   * Handles the click event on anchor elements.
   *
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

  private async _onHandlePopState (_ev: PopStateEvent): Promise<void> {
    const { href } = window.location

    this.navigate(
      { href },
      { enableHistoryPushState: false }
    )
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
