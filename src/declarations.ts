import { TemplateResult } from 'lit'

export type HTMLElementConstructor = typeof HTMLElement

export type Component = string | HTMLElementConstructor | (() => TemplateResult) | (() => Promise<unknown>)

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

export interface Navigation extends URL {
  path: string;
  query: Record<string, string>;
}
