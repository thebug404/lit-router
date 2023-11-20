import { Route } from './route.js'

export const TAG_NAME_ROUTER = 'lit-router' as const

export type HTMLElementConstructor = typeof HTMLElement

export type Component =
  string |
  HTMLElementConstructor |
  (() => Promise<HTMLElementConstructor>)

export interface Router {
  /**
   * List of registered routes.
   */
  routes (): Route[];
  /**
   * Get an object containing the query parameters of the current URL.
   *
   * @example
   * ```js
   * // URL: https://example.com?foo=bar&baz=qux
   * router.qs() // { foo: 'bar', baz: 'qux' }
   * 
   * router.qs('foo') // { foo: 'bar' }
   * ```
   */
  qs (name?: string): Record<string, string> | string | null;
  /**
   * Retrieves an object representing the parameters present in the current route.
   * 
   * @example
   * ```js
   * // URL: https://example.com/users/1
   * router.params() // { userId: '1' }
   * ```
   */
  params (name?: string): Record<string, string> | string | null;
  /**
   * Adds a callback function to be invoked when the router state changes.
   * 
   * @param _callback The callback function to be invoked.
   * @returns {Suscription} Returns a suscription object that can be used to unsubscribe the callback.
   * @example
   * ```js
   * const suscription = router.onChange((router) => {
   *   console.log(router)
   * })
   * 
   * suscription.unsubscribe()
   * ```
   */
  onChange (callback: (router: Router) => void): Suscription;
  /**
   * Adds a list of routes to the router configuration.
   *
   * @param routes A list of routes.
   */
  setRoutes (routes: Partial<RouteConfig>[]): void;
  /**
   * Navigates to a new route based on the provided navigation options.
   *
   * @param {Partial<Navigation>} navigation The navigation options, which can include 'name' or 'path'.
   * @param {Partial<NavigationOptions>} options The navigation options.
   */
  navigate (navigation: Partial<Navigation>, options?: Partial<NavigationOptions>): Promise<void>;
  /**
   * Navigates to the next page in session history.
   */
  forward (): void;
  /**
   * Navigates to the previous page in session history.
   */
  back (): void;
}

export type CustomRouterGuard = Omit<Router, 'onChange' | 'setRoutes' | 'routes'>

export type Guard = (router: CustomRouterGuard) => boolean | Promise<boolean>;

export interface RouteConfig {
  /**
   * The path of route.
   */
  path: string;
  /**
   * The component of route.
   * 
   * @example
   * ```ts
   * // String
   * { path: '/foo', component: 'foo-component' }
   * 
   * // HTMLElement
   * import { FooComponent } from './foo-component.js'
   * 
   * { path: '/foo', component: FooComponent }
   * 
   * // Lazy loading
   * {
   *   path: '/foo',
   *   component: () => import('./foo-component.js').then((m) => m.FooComponent)
   * }
   * ```
   */
  component: Component;
  /**
   * The children of route.
   * 
   * @example
   * ```ts
   * const routeConfig: RouteConfig = {
   *   path: '/foo',
   *   component: 'foo-component',
   *   children: [
   *     {
   *       path: '/bar',
   *       component: 'bar-component'
   *     }
   *   ]
   * }
   * ```
   */
  children?: RouteConfig[];
  /**
   * Callback executed before the route is entered.
   * 
   * @example
   * ```ts
   * const routeConfig: RouteConfig = {
   *   path: '/foo',
   *   component: 'foo-component',
   *   beforeEnter: [
   *     () => {
   *       // Do something...
   *       return true
   *     }
   *   ]
   * }
   * ```
   */
  beforeEnter?: Guard[];
}

export interface Suscription {
  /**
   * Unsubscribe the suscription.
   */
  unsubscribe: () => void
}

export interface Navigation {
  /**
   * Navigation path.
   */
  path: string;
  /**
   * Href associated with the navigation path.
   */
  href: string;
  /**
   * Query associated with the navigation path in the form of key-value pairs.
   */
  query: Record<string, string>;
}

export interface NavigationOptions {
  /**
   * Indicates whether 'window.history.pushState' should be enabled.
   */
  enableHistoryPushState: boolean;
}
