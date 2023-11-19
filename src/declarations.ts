import { LitRouter } from "./router";

export const TAG_NAME_ROUTER = 'lit-router' as const

export type HTMLElementConstructor = typeof HTMLElement

export type Component =
  string |
  HTMLElementConstructor |
  (() => Promise<HTMLElementConstructor>)

export type Guard = (router: LitRouter) => boolean | Promise<boolean>

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
