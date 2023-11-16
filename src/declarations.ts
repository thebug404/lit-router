import { TemplateResult } from 'lit'

export const TAG_NAME_ROUTER = 'lit-router' as const

export type HTMLElementConstructor = typeof HTMLElement

export type Component =
  string |
  HTMLElementConstructor |
  (() => TemplateResult) |
  (() => Promise<unknown>)

export interface RouteConfig {
  /**
   * The path of route.
   */
  path: string;
  /**
   * The component of route.
   */
  component: Component;
  /**
   * The children of route.
   */
  children?: RouteConfig[];
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
