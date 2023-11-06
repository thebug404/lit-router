import { TemplateResult } from 'lit'

export type HTMLElementConstructor = typeof HTMLElement

export type Component = string | HTMLElementConstructor | (() => TemplateResult) | (() => Promise<unknown>)

/**
 * The options for a route.
 */
export interface RouteOptions {
  /**
   * The path to match against.
   */
  path: string;
  /**
   * The name of the component to render.
   */
  name?: string;
  /**
   * The component to render.
   */
  component: Component;
}

export interface Navigation {
  /**
   * The path of route.
   */
  name: string;
  /**
   * The path of route.
   */
  path: string;
}

export interface NavigationOptions {
  /**
   * The router will not update the browser history. For default is `false`.
   */
  preventHistory?: boolean;
}
