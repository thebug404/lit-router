import { TemplateResult } from "lit";

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
  component: string | typeof HTMLElement | (() => TemplateResult);
}

/**
 * The options for a navigation.
 */
export interface NavigationOptions {
  /**
   * The path of route.
   */
  name: string;
  /**
   * The path of route.
   */
  path: string;
}
