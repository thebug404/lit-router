import { TemplateResult } from 'lit'

import { RouteOptions, Component, HTMLElementConstructor } from './declarations.js'

const _loadComponent = async (component: Component): Promise<unknown> => {
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

export class Route {
  readonly path: string

  private readonly _urlPattern: URLPattern

  readonly component: Component

  readonly name?: string

  private _parent: Route | null = null

  readonly children: Route[] = []

  constructor (options: RouteOptions) {
    this.path = options.path
    this.component = options.component
    this.name = options.name

    this.children = options.children || []
    this.children.forEach((child) => child.setParent(this))

    this._urlPattern = new URLPattern(this.path, window.location.origin)
  }

  setParent (parent: Route): void {
    this._parent = parent
  }

  match (path: string): boolean {
    return this._urlPattern.test(window.location.origin + path)
  }

  async resolve (component?: () => HTMLElement): Promise<unknown> {
    let _component: HTMLElement | null = component ? component() : null

    if (!_component) {
      _component = await _loadComponent(this.component) as unknown as HTMLElement
    }

    if (this._parent) {
      const parent = await _loadComponent(this._parent.component) as HTMLElement

      const child = _component

      parent.appendChild(child as HTMLElement)

      return this._parent.resolve(() => parent)
    }

    return _component
  }
}
