import { TemplateResult } from 'lit'

import { RouteOptions } from './declarations.js'

export class Route {
  readonly path: string

  private readonly _urlPattern: URLPattern

  readonly component: string | typeof HTMLElement | (() => TemplateResult)

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

  resolve (): unknown {
    const component = this.component
    const isFunction = typeof component === 'function'

    // If the component is a class, we instantiate it.
    if (isFunction && component.prototype instanceof HTMLElement) {
      return new (component as { new (): HTMLElement; prototype: HTMLElement; })()
    }

    // If the component is a function, we call it.
    if (isFunction) return (component as () => TemplateResult)()

    return document.createElement(component as string)
  }
}
