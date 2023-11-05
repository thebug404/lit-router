import { RouteOptions } from './declarations.js'

export class Route {
  readonly path: string

  private readonly _urlPattern: URLPattern

  readonly component: string

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
    const $component = document.createElement(this.component)

    return $component
  }
}
