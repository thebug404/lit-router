import { TemplateResult } from 'lit'

import { RouteOptions, Component, HTMLElementConstructor } from './declarations.js'

export class Route {
  readonly path: string

  private readonly _urlPattern: URLPattern

  readonly component: Component

  readonly name?: string

  constructor (options: RouteOptions) {
    this.path = options.path
    this.component = options.component
    this.name = options.name

    this._urlPattern = new URLPattern(this.path, window.location.origin)
  }

  match (path: string): boolean {
    return this._urlPattern.test(window.location.origin + path)
  }

  async resolve(): Promise<unknown> {
    const component = this.component;

    if (typeof component === 'function') {
      if (component.prototype instanceof HTMLElement) {
        return new (component as HTMLElementConstructor)();
      }

      const result = (component as () => TemplateResult | (() => Promise<unknown>))();

      if (result instanceof Promise) {
        const Module = await result;

        return new Module();
      }

      return result;
    }

    return document.createElement(component as string);
  }
}
