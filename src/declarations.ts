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
  component: string;
}
